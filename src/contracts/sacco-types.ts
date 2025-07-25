import { Address } from 'viem';

// Core Types
export type Member = {
    shares: bigint;
    savings: bigint;
    lastInterestUpdate: bigint;
    joinDate: bigint;
    isActive: boolean;
    totalLoansReceived: bigint;
    guaranteeCapacity: bigint;
};

export type Proposal = {
    description: string;
    deadline: bigint;
    yesVotes: bigint;
    noVotes: bigint;
    executed: boolean;
    proposer: Address;
    proposalType: ProposalType;
    targetMember: Address;
};

export type LoanGuarantee = {
    guarantor: Address;
    amount: bigint;
    active: boolean;
};

export enum ProposalType {
    GENERAL,
    MEMBER_REGISTRATION,
    INTEREST_RATE_CHANGE,
    DIVIDEND_DISTRIBUTION,
    BOARD_MEMBER_ADDITION,
    BOARD_MEMBER_REMOVAL
}

export type BoardMember = {
    memberAddress: Address;
    appointedDate: bigint;
    votes: bigint;
    isActive: boolean;
};

export type CommitteeBid = {
    bidder: Address;
    proposal: string;
    bidAmount: bigint;
    submissionDate: bigint;
    votes: bigint;
    isActive: boolean;
};

export type Loan = {
    amount: bigint;
    repaymentAmount: bigint;
    duration: bigint;
    startTime: bigint;
    nextRepaymentTime: bigint;
    repaidAmount: bigint;
    repaid: boolean;
    borrower: Address;
    guaranteeRequired: bigint;
    guaranteeProvided: bigint;
};

// Event Types
export type MemberRegisteredEvent = {
    member: Address;
    shares: bigint;
};

export type SharesPurchasedEvent = {
    member: Address;
    shares: bigint;
    amount: bigint;
};

export type SavingsDepositedEvent = {
    member: Address;
    amount: bigint;
};

export type InterestPaidEvent = {
    member: Address;
    amount: bigint;
};

export type GuaranteeProvidedEvent = {
    guarantor: Address;
    loanId: bigint;
    amount: bigint;
};

export type GuaranteeReleasedEvent = {
    guarantor: Address;
    loanId: bigint;
    amount: bigint;
};

export type LoanIssuedEvent = {
    borrower: Address;
    amount: bigint;
    loanId: bigint;
};

export type LoanRepaidEvent = {
    borrower: Address;
    loanId: bigint;
    amount: bigint;
};

export type DividendPaidEvent = {
    member: Address;
    amount: bigint;
};

export type BoardMemberAddedEvent = {
    member: Address;
    votes: bigint;
};

export type BoardMemberRemovedEvent = {
    member: Address;
};

export type CommitteeBidSubmittedEvent = {
    bidder: Address;
    bidId: bigint;
    amount: bigint;
};

export type CommitteeBidVotedEvent = {
    voter: Address;
    bidId: bigint;
    votes: bigint;
};

export type CommitteeBidAcceptedEvent = {
    bidder: Address;
    bidId: bigint;
};

// Contract Constants
export const SACCO_CONSTANTS = {
    MINIMUM_SHARES: BigInt(10),
    SHARE_PRICE: BigInt('1000000000000000'), // 0.001 ETH
    SECONDS_PER_YEAR: BigInt(31536000), // 365 * 24 * 60 * 60
    SAVINGS_INTEREST_RATE: BigInt(5),
    LOAN_INTEREST_RATE: BigInt(10),
    MAX_BOARD_MEMBERS: BigInt(3),
    MIN_BID_AMOUNT: BigInt('10000000000000000'), // 0.01 ETH
    VOTING_DURATION: BigInt(604800) // 7 days
} as const;

// Contract Function Types
export type SaccoContractFunctions = {
    // Member Management
    purchaseShares: readonly [bigint]; // shares (payable)
    proposeMembership: readonly [Address]; // candidate
    getMemberInfo: readonly [Address]; // member address
    
    // Savings Functions
    depositSavings: readonly []; // payable
    calculateInterestForAllMembers: readonly [];
    
    // Loan Functions
    requestLoan: readonly [bigint, bigint, string]; // amount, duration, purpose
    repayLoan: readonly [bigint]; // loanId (payable)
    provideGuarantee: readonly [bigint]; // loanId (payable)
    penalizeLatePayment: readonly [bigint]; // loanId
    
    // Governance Functions
    createProposal: readonly [string, ProposalType]; // description, type
    vote: readonly [bigint, boolean]; // proposalId, support
    executeProposal: readonly [bigint]; // proposalId
    
    // Board Management
    submitCommitteeBid: readonly [string]; // proposal (payable)
    voteOnCommitteeBid: readonly [bigint, bigint]; // bidId, votes
    removeBoardMember: readonly [Address]; // member
    
    // View Functions
    getLoanGuarantees: readonly [bigint]; // loanId
    getMaxLoanAmount: readonly [Address]; // member
    getBoardMembers: readonly [];
    getCommitteeBids: readonly [];
    getActiveBoardMembersCount: readonly [];
    getActiveBidsCount: readonly [];
    getBidVotes: readonly [bigint]; // bidId
    hasVotedOnBidCheck: readonly [bigint, Address]; // bidId, voter
};
