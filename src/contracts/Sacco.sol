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
    uint256 public constant LOAN_INTEREST_RATE = 10;

    constructor() Ownable(msg.sender) {
        // Deploy storage and modules
        saccoStorage = new SaccoStorage();
        saccoMembers = new SaccoMembers(address(saccoStorage));
        saccoLoans = new SaccoLoans(address(saccoStorage));

        // Authorize modules
        saccoStorage.addAuthorizedContract(address(saccoMembers));
        saccoStorage.addAuthorizedContract(address(saccoLoans));

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
        saccoMembers.depositSavings{value: msg.value}();
    }

    function withdrawSavings(uint256 _amount) external {
        saccoMembers.withdrawSavings(_amount);
    }

    // Loan Management Functions
    function requestLoan(uint256 _amount, uint256 _duration, string calldata _purpose) external {
        saccoLoans.requestLoan(_amount, _duration, _purpose);
    }

    function provideGuarantee(uint256 _loanId) external payable {
        saccoLoans.provideGuarantee{value: msg.value}(_loanId);
    }

    function repayLoan(uint256 _loanId) external payable {
        saccoLoans.repayLoan{value: msg.value}(_loanId);
    }

    // Dividend Management Functions
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

    // Additional View Functions needed by frontend
    function getTotalProposals() external view returns (uint256) {
        return saccoStorage.getTotalProposals();
    }

    function getNextLoanId() external view returns (uint256) {
        return saccoLoans.nextLoanId();
    }

    function getTotalShares() external view returns (uint256) {
        return saccoStorage.getTotalShares();
    }

    function getTotalSavings() external view returns (uint256) {
        return saccoStorage.getTotalSavings();
    }

    // Receive function to accept ETH
    receive() external payable {}
}
