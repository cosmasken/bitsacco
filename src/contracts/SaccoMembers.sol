// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ISacco.sol";
import "./SaccoStorage.sol";

contract SaccoMembers is ReentrancyGuard, ISacco {
    SaccoStorage internal _storage;

    // Constants
    uint256 public constant MINIMUM_SHARES = 10;
    uint256 public constant SHARE_PRICE = 0.001 ether;
    uint256 public constant SAVINGS_INTEREST_RATE = 5;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public constant DIVIDEND_DISTRIBUTION_THRESHOLD = 50;

    // Events
    event DividendDistributed(address indexed member, uint256 amount);
    event InterestCalculated(address indexed member, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed candidate);

    constructor(address storageAddress) {
        _storage = SaccoStorage(storageAddress);
    }

    modifier onlyMember() {
        require(_storage.isMemberActive(msg.sender), "Only active members can perform this action");
        _;
    }

    function purchaseShares(uint256 _shares) external payable nonReentrant {
        require(_shares >= MINIMUM_SHARES, "Must purchase minimum shares");
        require(msg.value == _shares * SHARE_PRICE, "Incorrect payment amount");
        
        if (!_storage.isMemberActive(msg.sender)) {
            require(_shares == MINIMUM_SHARES, "New members can only buy minimum shares initially");
            _createMembershipProposal(msg.sender);
            return;
        }
        
        _addShares(msg.sender, _shares, msg.value);
    }
    
    function proposeMembership(address _candidate) external onlyMember {
        require(!_storage.isMemberActive(_candidate), "Already a member");
        _createMembershipProposal(_candidate);
    }

    function _createMembershipProposal(address _candidate) internal {
        uint256 proposalId = _storage.createProposal(
            string(abi.encodePacked("Membership proposal for ", _addressToString(_candidate))),
            ProposalType.MEMBER_REGISTRATION,
            _candidate
        );
        
        emit ProposalCreated(proposalId, _candidate);
        emit MembershipProposed(msg.sender, _candidate);
    }
    
    function _addShares(address _member, uint256 _shares, uint256 _payment) internal {
        if (!_storage.isMemberActive(_member)) {
            Member memory newMember = Member({
                shares: _shares,
                savings: 0,
                lastInterestUpdate: block.timestamp,
                joinDate: block.timestamp,
                isActive: true,
                totalLoansReceived: 0,
                guaranteeCapacity: _shares * SHARE_PRICE / 2
            });
            _storage.addMember(_member, newMember);
            emit MemberRegistered(_member, _shares);
        } else {
            _storage.updateMemberShares(_member, _shares);
        }
        
        emit SharesPurchased(_member, _shares, _payment);
    }

    function depositSavings() external payable onlyMember nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        
        _calculateAndPayInterest(msg.sender);
        _storage.updateMemberSavings(msg.sender, msg.value, true);
        
        emit SavingsDeposited(msg.sender, msg.value);
    }

    function withdrawSavings(uint256 _amount) external onlyMember nonReentrant {
        Member memory member = _storage.getMember(msg.sender);
        require(_amount > 0 && _amount <= member.savings, "Invalid withdrawal amount");
        
        _calculateAndPayInterest(msg.sender);
        _storage.updateMemberSavings(msg.sender, _amount, false);
        
        payable(msg.sender).transfer(_amount);
    }

    function _calculateAndPayInterest(address _member) internal {
        Member memory member = _storage.getMember(_member);
        if (member.savings == 0) return;
        
        uint256 timeElapsed = block.timestamp - member.lastInterestUpdate;
        uint256 interest = (member.savings * SAVINGS_INTEREST_RATE * timeElapsed) / 
            (100 * SECONDS_PER_YEAR);
        
        if (interest > 0) {
            _storage.updateMemberSavings(_member, interest, true);
            emit InterestCalculated(_member, interest);
        }
    }

    function calculateInterestForAllMembers() external {
        address[] memory memberAddresses = _storage.getMemberAddresses();
        for (uint i = 0; i < memberAddresses.length; i++) {
            if (_storage.isMemberActive(memberAddresses[i])) {
                _calculateAndPayInterest(memberAddresses[i]);
            }
        }
    }

    function distributeDividends() external onlyMember nonReentrant {
        Member memory distributor = _storage.getMember(msg.sender);
        require(distributor.shares >= DIVIDEND_DISTRIBUTION_THRESHOLD, 
            "Insufficient shares to distribute dividends");
        
        uint256 surplus = address(this).balance - _storage.getTotalSavings();
        require(surplus > 0, "No surplus for dividends");
        
        uint256 dividendPool = surplus / 2;
        uint256 totalWeightedShares = _calculateTotalWeightedShares();
        
        address[] memory memberAddresses = _storage.getMemberAddresses();
        for (uint i = 0; i < memberAddresses.length; i++) {
            address memberAddr = memberAddresses[i];
            if (_storage.isMemberActive(memberAddr)) {
                uint256 memberWeight = _calculateMemberWeight(memberAddr);
                uint256 dividend = (dividendPool * memberWeight) / totalWeightedShares;
                
                if (dividend > 0) {
                    payable(memberAddr).transfer(dividend);
                    emit DividendDistributed(memberAddr, dividend);
                }
            }
        }
    }

    function _calculateMemberWeight(address _member) internal view returns (uint256) {
        Member memory member = _storage.getMember(_member);
        return member.shares + (member.savings / SHARE_PRICE) / 10;
    }

    function _calculateTotalWeightedShares() internal view returns (uint256) {
        uint256 total = 0;
        address[] memory memberAddresses = _storage.getMemberAddresses();
        for (uint i = 0; i < memberAddresses.length; i++) {
            if (_storage.isMemberActive(memberAddresses[i])) {
                total += _calculateMemberWeight(memberAddresses[i]);
            }
        }
        return total;
    }

    function getMemberInfo(address _member) external view returns (
        uint256 shares,
        uint256 savings,
        uint256 joinDate,
        bool isActive,
        uint256 totalLoansReceived,
        uint256 guaranteeCapacity
    ) {
        Member memory member = _storage.getMember(_member);
        return (
            member.shares,
            member.savings,
            member.joinDate,
            member.isActive,
            member.totalLoansReceived,
            member.guaranteeCapacity
        );
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}
