// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISacco.sol";

contract SaccoStorage is Ownable, ISacco {
    // Storage
    mapping(address => Member) private members;
    mapping(uint256 => Proposal) private proposals;
    mapping(uint256 => mapping(address => bool)) private hasVoted;
    address[] private memberAddresses;
    uint256 private totalProposals;
    uint256 private totalShares;
    uint256 private totalSavings;

    // Access Control
    mapping(address => bool) public authorizedContracts;

    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender], "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Constructor logic
    }

    function addAuthorizedContract(address _contract) external onlyOwner {
        authorizedContracts[_contract] = true;
    }

    function removeAuthorizedContract(address _contract) external onlyOwner {
        authorizedContracts[_contract] = false;
    }

    // Member Management
    function addMember(address _member, Member memory _memberData) external onlyAuthorized {
        members[_member] = _memberData;
        memberAddresses.push(_member);
        totalShares += _memberData.shares;
    }

    function updateMemberShares(address _member, uint256 _additionalShares) external onlyAuthorized {
        members[_member].shares += _additionalShares;
        members[_member].guaranteeCapacity += _additionalShares * 0.001 ether / 2;
        totalShares += _additionalShares;
    }

    function updateMemberSavings(address _member, uint256 _amount, bool _isDeposit) external onlyAuthorized {
        if (_isDeposit) {
            members[_member].savings += _amount;
            totalSavings += _amount;
        } else {
            members[_member].savings -= _amount;
            totalSavings -= _amount;
        }
    }

    // Proposal Management
    function createProposal(
        string memory _description,
        ProposalType _type,
        address _targetMember
    ) external onlyAuthorized returns (uint256) {
        uint256 proposalId = totalProposals++;
        proposals[proposalId] = Proposal({
            description: _description,
            deadline: block.timestamp + 7 days,
            yesVotes: 0,
            noVotes: 0,
            executed: false,
            proposer: msg.sender,
            proposalType: _type,
            targetMember: _targetMember
        });
        return proposalId;
    }

    // View Functions
    function getMember(address _member) external view returns (Member memory) {
        return members[_member];
    }

    function isMemberActive(address _member) external view returns (bool) {
        return members[_member].isActive;
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    function getMemberAddresses() external view returns (address[] memory) {
        return memberAddresses;
    }

    function getTotalShares() external view returns (uint256) {
        return totalShares;
    }

    function getTotalSavings() external view returns (uint256) {
        return totalSavings;
    }

    function getTotalProposals() external view returns (uint256) {
        return totalProposals;
    }
}
