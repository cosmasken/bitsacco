// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SaccoSavings.sol";

contract SaccoLoans is SaccoSavings {
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

    mapping(uint256 => Loan) public loans;
    uint256 public nextLoanId;

    event LoanIssued(address indexed borrower, uint256 amount, uint256 loanId);
    event LoanRepaid(address indexed borrower, uint256 loanId, uint256 amount);

    function requestLoan(uint256 _amount, uint256 _duration) external {
        require(isMember(msg.sender), "Not a member");
        uint256 maxLoanAmount = _calculateMaxLoanAmount(msg.sender);
        require(_amount <= maxLoanAmount, "Loan amount exceeds limit");

        uint256 repaymentAmount = _amount + (_amount * 10 * _duration) / (100 * SECONDS_PER_YEAR);

        loans[nextLoanId] = Loan({
            amount: _amount,
            repaymentAmount: repaymentAmount,
            duration: _duration,
            startTime: block.timestamp,
            nextRepaymentTime: block.timestamp + (_duration / 4),
            repaidAmount: 0,
            repaid: false,
            borrower: msg.sender,
            guaranteeRequired: 0,
            guaranteeProvided: 0
        });

        emit LoanIssued(msg.sender, _amount, nextLoanId);
        nextLoanId++;
    }

    function approveLoan(address borrower) external {
        // This function would have more complex logic in a real scenario
        // For now, we will just mark the loan as approved
    }

    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(!loan.repaid, "Loan already repaid");
        require(msg.value > 0, "Repayment amount must be greater than zero");

        uint256 remainingAmount = loan.repaymentAmount - loan.repaidAmount;
        uint256 amountToRepay = msg.value > remainingAmount ? remainingAmount : msg.value;

        loan.repaidAmount += amountToRepay;

        if (loan.repaidAmount >= loan.repaymentAmount) {
            loan.repaid = true;
        }

        if (msg.value > amountToRepay) {
            payable(msg.sender).transfer(msg.value - amountToRepay);
        }

        emit LoanRepaid(msg.sender, loanId, amountToRepay);
    }

    function getLoans(address _member) public view returns (uint256[] memory) {
        // This is a placeholder, a proper implementation would be needed
        return new uint256[](0);
    }

    function _calculateMaxLoanAmount(address _member) internal view returns (uint256) {
        Member storage member = members[_member];
        uint256 savingsMultiplier;

        if (block.timestamp - member.joinDate < 90 days) {
            savingsMultiplier = 2; // 2x savings for new members
        } else if (block.timestamp - member.joinDate < 365 days) {
            savingsMultiplier = 3; // 3x savings for members < 1 year
        } else {
            savingsMultiplier = 5; // 5x savings for established members
        }

        return member.savings * savingsMultiplier;
    }

    function calculateLoanLimit(address _member) public view returns (uint256) {
        return _calculateMaxLoanAmount(_member);
    }
}