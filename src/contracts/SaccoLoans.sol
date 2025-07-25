// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ISacco.sol";
import "./SaccoStorage.sol";

contract SaccoLoans is ReentrancyGuard {
    SaccoStorage internal _storage;
    
    struct Loan {
        uint256 amount;
        uint256 repaymentAmount;
        uint256 duration;
        uint256 startTime;
        uint256 nextRepaymentTime;
        uint256 repaidAmount;
        bool repaid;
        address borrower;
        uint256 guaranteeRequired;
        uint256 guaranteeProvided;
    }
    
    struct LoanGuarantee {
        address guarantor;
        uint256 amount;
        bool active;
    }

    // Constants
    uint256 public constant LOAN_INTEREST_RATE = 10; // 10% per annum
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

    // Storage
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => LoanGuarantee[]) public loanGuarantees;
    mapping(address => uint256[]) public memberLoans;
    uint256 public nextLoanId;

    // Events
    event LoanRequested(address indexed borrower, uint256 amount, uint256 loanId);
    event GuaranteeProvided(address indexed guarantor, uint256 loanId, uint256 amount);
    event LoanIssued(address indexed borrower, uint256 amount, uint256 loanId);
    event LoanRepaid(address indexed borrower, uint256 loanId, uint256 amount);
    event GuaranteeReleased(address indexed guarantor, uint256 loanId, uint256 amount);

    constructor(address storageAddress) {
        _storage = SaccoStorage(storageAddress);
    }

    modifier onlyMember() {
        require(_storage.isMemberActive(msg.sender), "Only active members can perform this action");
        _;
    }

    // Removed unused _purpose parameter
    function requestLoan(uint256 _amount, uint256 _duration) external onlyMember nonReentrant {
        require(_amount > 0, "Loan amount must be greater than zero");
        require(_duration >= 30 days && _duration <= 365 days, "Invalid loan duration");
        
        ISacco.Member memory borrower = _storage.getMember(msg.sender);
        
        // Calculate loan limit based on savings and membership duration
        uint256 maxLoanAmount = _calculateMaxLoanAmount(msg.sender);
        require(_amount <= maxLoanAmount, "Loan amount exceeds limit");
        
        // Calculate guarantee requirement
        uint256 guaranteeRequired = _calculateGuaranteeRequired(msg.sender, _amount);
        
        uint256 repaymentAmount = _calculateRepaymentAmount(_amount, _duration);
        
        loans[nextLoanId] = Loan({
            amount: _amount,
            repaymentAmount: repaymentAmount,
            duration: _duration,
            startTime: block.timestamp,
            nextRepaymentTime: block.timestamp + (_duration / 4),
            repaidAmount: 0,
            repaid: false,
            borrower: msg.sender,
            guaranteeRequired: guaranteeRequired,
            guaranteeProvided: 0
        });
        
        memberLoans[msg.sender].push(nextLoanId);
        
        emit LoanRequested(msg.sender, _amount, nextLoanId);
        nextLoanId++;
    }

    function provideGuarantee(uint256 _loanId) external payable onlyMember nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.borrower != msg.sender, "Cannot guarantee own loan");
        require(!loan.repaid, "Loan already repaid");
        require(msg.value > 0, "Guarantee amount must be greater than zero");
        
        ISacco.Member memory guarantor = _storage.getMember(msg.sender);
        require(guarantor.guaranteeCapacity >= msg.value, "Insufficient guarantee capacity");
        
        loanGuarantees[_loanId].push(LoanGuarantee({
            guarantor: msg.sender,
            amount: msg.value,
            active: true
        }));
        
        loan.guaranteeProvided += msg.value;
        
        emit GuaranteeProvided(msg.sender, _loanId, msg.value);
        
        if (loan.guaranteeProvided >= loan.guaranteeRequired) {
            _disburseLoan(_loanId);
        }
    }

    function repayLoan(uint256 _loanId) external payable onlyMember nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(!loan.repaid, "Loan already repaid");
        require(msg.value > 0, "Repayment amount must be greater than zero");
        
        uint256 remainingAmount = loan.repaymentAmount - loan.repaidAmount;
        uint256 amountToRepay = msg.value > remainingAmount ? remainingAmount : msg.value;
        
        loan.repaidAmount += amountToRepay;
        
        if (loan.repaidAmount >= loan.repaymentAmount) {
            loan.repaid = true;
            _releaseGuarantees(_loanId);
        }
        
        if (msg.value > amountToRepay) {
            payable(msg.sender).transfer(msg.value - amountToRepay);
        }
        
        emit LoanRepaid(msg.sender, _loanId, amountToRepay);
    }

    // Internal functions
    function _calculateMaxLoanAmount(address _member) internal view returns (uint256) {
        ISacco.Member memory member = _storage.getMember(_member);
        uint256 savingsMultiplier;
        
        if (block.timestamp - member.joinDate < 90 days) {
            savingsMultiplier = 2;
        } else if (block.timestamp - member.joinDate < 365 days) {
            savingsMultiplier = 3;
        } else {
            savingsMultiplier = 5;
        }
        
        return member.savings * savingsMultiplier;
    }

    function _calculateGuaranteeRequired(address _member, uint256 _amount) internal view returns (uint256) {
        ISacco.Member memory member = _storage.getMember(_member);
        
        if (block.timestamp - member.joinDate < 365 days) {
            return _amount / 2; // 50% for new members
        } else if (member.totalLoansReceived < 3) {
            return _amount / 4; // 25% for members with few loans
        }
        return 0;
    }

    function _calculateRepaymentAmount(uint256 _amount, uint256 _duration) internal pure returns (uint256) {
        return _amount + (_amount * LOAN_INTEREST_RATE * _duration) / (100 * SECONDS_PER_YEAR);
    }

    function _disburseLoan(uint256 _loanId) internal {
        Loan storage loan = loans[_loanId];
        require(address(this).balance >= loan.amount, "Insufficient SACCO funds");
        
        payable(loan.borrower).transfer(loan.amount);
        emit LoanIssued(loan.borrower, loan.amount, _loanId);
    }

    function _releaseGuarantees(uint256 _loanId) internal {
        LoanGuarantee[] storage guarantees = loanGuarantees[_loanId];
        
        for (uint i = 0; i < guarantees.length; i++) {
            if (guarantees[i].active) {
                address guarantor = guarantees[i].guarantor;
                uint256 amount = guarantees[i].amount;
                
                payable(guarantor).transfer(amount);
                guarantees[i].active = false;
                
                emit GuaranteeReleased(guarantor, _loanId, amount);
            }
        }
    }

    // View functions
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    function getMemberLoans(address _member) external view returns (uint256[] memory) {
        return memberLoans[_member];
    }

    function getLoanGuarantees(uint256 _loanId) external view returns (LoanGuarantee[] memory) {
        return loanGuarantees[_loanId];
    }

    function getMaxLoanAmount(address _member) external view returns (uint256) {
        return _calculateMaxLoanAmount(_member);
    }
}
