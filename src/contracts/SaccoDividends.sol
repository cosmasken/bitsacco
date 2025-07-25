// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SaccoMembers.sol";

contract SaccoDividends is SaccoMembers {

    event DividendPaid(address indexed member, uint256 amount);

    function distributeDividends() external {
        require(isMember(msg.sender), "Not a member");
        uint256 totalMemberWeight = 0;
        for (uint i = 0; i < memberAddresses.length; i++) {
            totalMemberWeight += _calculateMemberWeight(memberAddresses[i]);
        }

        uint256 dividendPool = address(this).balance / 2;

        for (uint i = 0; i < memberAddresses.length; i++) {
            address memberAddr = memberAddresses[i];
            if (members[memberAddr].isActive) {
                uint256 memberWeight = _calculateMemberWeight(memberAddr);
                uint256 dividend = (dividendPool * memberWeight) / totalMemberWeight;

                if (dividend > 0) {
                    payable(memberAddr).transfer(dividend);
                    emit DividendPaid(memberAddr, dividend);
                }
            }
        }
    }

    function getDividendBalance(address _member) public view returns (uint256) {
        // Placeholder
        return 0;
    }

    function _calculateMemberWeight(address _member) internal view returns (uint256) {
        Member storage member = members[_member];
        return member.shares + (member.savings / SHARE_PRICE) / 10;
    }
}