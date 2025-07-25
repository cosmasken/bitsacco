// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ISacco.sol";
import "./SaccoStorage.sol";
import "./SaccoMembers.sol";
import "./SaccoLoans.sol";

contract SACCO is Ownable, ReentrancyGuard, ISacco {
    SaccoStorage public immutable saccoStorage;
    SaccoMembers public immutable saccoMembers;
    SaccoLoans public immutable saccoLoans;

    // Constants from SaccoMembers
    uint256 public constant MINIMUM_SHARES = 10;
    uint256 public constant SHARE_PRICE = 0.001 ether;
    uint256 public constant SAVINGS_INTEREST_RATE = 5;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

    // Events

    constructor() Ownable(msg.sender) {
        // Deploy storage and modules
        saccoStorage = new SaccoStorage();
        saccoMembers = new SaccoMembers(address(saccoStorage));
        saccoLoans = new SaccoLoans(address(saccoStorage));

        // Authorize modules
        saccoStorage.addAuthorizedContract(address(saccoMembers));
        saccoStorage.addAuthorizedContract(address(saccoLoans));
        saccoStorage.addAuthorizedContract(address(this));

        // Initialize founder as first member
        saccoMembers.purchaseShares{value: MINIMUM_SHARES * SHARE_PRICE}(MINIMUM_SHARES);
    }

    // Member Management Functions
    function purchaseShares(uint256 _shares) external payable {
        saccoMembers.purchaseShares{value: msg.value}(_shares);
    }

    function proposeMembership(address _candidate) external {
        saccoMembers.proposeMembership(_candidate);
    }

    // Savings Management Functions
    function depositSavings() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        
        // Calculate and pay interest before updating savings
        _calculateAndPayInterest(msg.sender);
        
        // Update savings through SaccoMembers
        saccoMembers.depositSavings{value: msg.value}();
        
        emit SavingsDeposited(msg.sender, msg.value);
    }

    function withdrawSavings(uint256 _amount) external {
        // Calculate interest before withdrawal
        _calculateAndPayInterest(msg.sender);
        
        // Withdraw through SaccoMembers
        saccoMembers.withdrawSavings(_amount);
        
        emit SavingsWithdrawn(msg.sender, _amount);
    }

    function _calculateAndPayInterest(address _member) internal {
        ISacco.Member memory member = saccoStorage.getMember(_member);
        if (member.savings == 0) return;
        
        uint256 timeElapsed = block.timestamp - member.lastInterestUpdate;
        uint256 interest = (member.savings * SAVINGS_INTEREST_RATE * timeElapsed) / 
            (100 * SECONDS_PER_YEAR);
        
        if (interest > 0) {
            saccoStorage.updateMemberSavings(_member, interest, true);
            emit InterestPaid(_member, interest);
        }
    }

    // Loan Management Functions
    function requestLoan(uint256 _amount, uint256 _duration) external {
        saccoLoans.requestLoan(_amount, _duration);
    }

    function provideGuarantee(uint256 _loanId) external payable {
        saccoLoans.provideGuarantee{value: msg.value}(_loanId);
    }

    function repayLoan(uint256 _loanId) external payable {
        saccoLoans.repayLoan{value: msg.value}(_loanId);
    }

    // Dividend and Interest Functions
    function distributeDividends() external {
        saccoMembers.distributeDividends();
    }

    function calculateInterestForAllMembers() external {
        saccoMembers.calculateInterestForAllMembers();
    }

    // View Functions - Member Info
    function getMemberInfo(address _member) external view returns (
        uint256 shares,
        uint256 savings,
        uint256 joinDate,
        bool isActive,
        uint256 totalLoansReceived,
        uint256 guaranteeCapacity
    ) {
        return saccoMembers.getMemberInfo(_member);
    }

    function getTotalShares() external view returns (uint256) {
        return saccoStorage.getTotalShares();
    }

    function getTotalSavings() external view returns (uint256) {
        return saccoStorage.getTotalSavings();
    }

    function getTotalProposals() external view returns (uint256) {
        return saccoStorage.getTotalProposals();
    }

    // View Functions - Loans
    function getLoan(uint256 _loanId) external view returns (SaccoLoans.Loan memory) {
        return saccoLoans.getLoan(_loanId);
    }

    function getMemberLoans(address _member) external view returns (uint256[] memory) {
        return saccoLoans.getMemberLoans(_member);
    }

    function getMaxLoanAmount(address _member) external view returns (uint256) {
        return saccoLoans.getMaxLoanAmount(_member);
    }

    function getLoanGuarantees(uint256 _loanId) external view returns (SaccoLoans.LoanGuarantee[] memory) {
        return saccoLoans.getLoanGuarantees(_loanId);
    }

    function getNextLoanId() external view returns (uint256) {
        return saccoLoans.nextLoanId();
    }

    // Additional Member Functions
    function isMemberActive(address _member) external view returns (bool) {
        return saccoStorage.isMemberActive(_member);
    }

    function getMemberSavings(address _member) external view returns (uint256) {
        ISacco.Member memory member = saccoStorage.getMember(_member);
        return member.savings;
    }

    function getMemberShares(address _member) external view returns (uint256) {
        ISacco.Member memory member = saccoStorage.getMember(_member);
        return member.shares;
    }

    // Receive function to accept ETH
    receive() external payable {}

    // Fallback function
    fallback() external payable {}
}
