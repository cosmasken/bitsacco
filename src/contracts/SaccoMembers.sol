// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SaccoShares.sol";

contract SaccoMembers is SaccoShares {
    struct Member {
        uint256 shares;
        uint256 savings;
        uint256 lastInterestUpdate;
        uint256 joinDate;
        bool isActive;
        uint256 totalLoansReceived;
        uint256 guaranteeCapacity;
    }

    mapping(address => Member) public members;
    address[] public memberAddresses;

    event MemberRegistered(address indexed member, uint256 shares);

    function _registerMember(address _member, uint256 _shares) internal {
        require(!members[_member].isActive, "Member already registered.");
        members[_member] = Member({
            shares: _shares,
            savings: 0,
            lastInterestUpdate: block.timestamp,
            joinDate: block.timestamp,
            isActive: true,
            totalLoansReceived: 0,
            guaranteeCapacity: 0
        });
        memberAddresses.push(_member);
        _purchaseShares(_member, _shares);
        emit MemberRegistered(_member, _shares);
    }

    function isMember(address _member) public view returns (bool) {
        return members[_member].isActive;
    }

    function getMember(address _member) public view returns (Member memory) {
        return members[_member];
    }

    function getAllMembers() public view returns (address[] memory) {
        return memberAddresses;
    }
}