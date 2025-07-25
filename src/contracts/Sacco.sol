// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SaccoMembers.sol";
import "./SaccoLoans.sol";
import "./SaccoGovernance.sol";
import "./SaccoDividends.sol";

contract SACCO is ReentrancyGuard, SaccoMembers, SaccoLoans, SaccoGovernance, SaccoDividends {

    constructor() {
        _registerMember(msg.sender, MINIMUM_SHARES);
    }

    // The following functions are overridden to ensure they are only callable by members
    // and to provide a single entry point from the main SACCO contract.

    function purchaseShares(uint256 _shares) external payable nonReentrant {
        require(_shares >= MINIMUM_SHARES, "Must purchase minimum shares");
        require(msg.value == _shares * SHARE_PRICE, "Incorrect payment amount");
        _purchaseShares(msg.sender, _shares);
    }

    function depositSavings() external payable nonReentrant {
        SaccoSavings.depositSavings();
    }

    function requestLoan(uint256 _amount, uint256 _duration) external nonReentrant {
        SaccoLoans.requestLoan(_amount, _duration);
    }

    function repayLoan(uint256 _loanId) external payable nonReentrant {
        SaccoLoans.repayLoan(_loanId);
    }

    function distributeDividends() external nonReentrant {
        SaccoDividends.distributeDividends();
    }

    function createProposal(string calldata description) external {
        SaccoGovernance.createProposal(description);
    }

    function voteOnProposal(uint256 proposalId, bool support) external {
        SaccoGovernance.voteOnProposal(proposalId, support);
    }

    function executeProposal(uint256 proposalId) external {
        SaccoGovernance.executeProposal(proposalId);
    }
}