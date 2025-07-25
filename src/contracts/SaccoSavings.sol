// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SaccoMembers.sol";

contract SaccoSavings is SaccoMembers {
    uint256 public constant SAVINGS_INTEREST_RATE = 5; // 5% per annum
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    event SavingsDeposited(address indexed member, uint256 amount);
    event InterestPaid(address indexed member, uint256 amount);

    function depositSavings() external payable {
        require(isMember(msg.sender), "Not a member");
        _calculateAndPayInterest(msg.sender);
        members[msg.sender].savings += msg.value;
        emit SavingsDeposited(msg.sender, msg.value);
    }

    function withdrawSavings(uint256 amount) external {
        require(isMember(msg.sender), "Not a member
        ");
        require(members[msg.sender].savings >= amount, "Insufficient savings");
        _calculateAndPayInterest(msg.sender);
        members[msg.sender].savings -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getSavings(address _member) public view returns (uint256) {
        return members[_member].savings;
    }

    function _calculateAndPayInterest(address _member) internal {
        Member storage member = members[_member];
        if (member.savings == 0) return;

        uint256 timeElapsed = block.timestamp - member.lastInterestUpdate;
        uint256 interest = (member.savings * SAVINGS_INTEREST_RATE * timeElapsed) / (100 * SECONDS_PER_YEAR);

        if (interest > 0 && address(this).balance >= interest) {
            member.savings += interest;
            member.lastInterestUpdate = block.timestamp;
            emit InterestPaid(_member, interest);
        }
    }

    function calculateInterest(address _member) public {
        _calculateAndPayInterest(_member);
    }
}