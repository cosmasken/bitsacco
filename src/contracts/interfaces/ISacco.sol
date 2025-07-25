// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ISacco {
    struct Member {
        uint256 shares;
        uint256 savings;
        uint256 lastInterestUpdate;
        uint256 joinDate;
        bool isActive;
        uint256 totalLoansReceived;
        uint256 guaranteeCapacity;
    }
    
    struct Proposal {
        string description;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        address proposer;
        ProposalType proposalType;
        address targetMember;
    }
    
    enum ProposalType {
        GENERAL,
        MEMBER_REGISTRATION,
        INTEREST_RATE_CHANGE,
        DIVIDEND_DISTRIBUTION,
        BOARD_MEMBER_ADDITION,
        BOARD_MEMBER_REMOVAL
    }

    // Events
    event SharesPurchased(address indexed member, uint256 shares, uint256 amount);
    event MemberRegistered(address indexed member, uint256 shares);
    event MembershipProposed(address indexed proposer, address indexed candidate);
     event SavingsDeposited(address indexed member, uint256 amount);
    event SavingsWithdrawn(address indexed member, uint256 amount);
    event InterestPaid(address indexed member, uint256 amount);
}
