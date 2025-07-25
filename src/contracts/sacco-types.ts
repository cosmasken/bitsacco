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

export type LoanGuarantee = {
    guarantor: Address;
    amount: bigint;
    active: boolean;
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

export type SavingsWithdrawnEvent = {
    member: Address;
    amount: bigint;
};

export type InterestPaidEvent = {
    member: Address;
    amount: bigint;
};

export type LoanRequestedEvent = {
    borrower: Address;
    amount: bigint;
    loanId: bigint;
};

export type GuaranteeProvidedEvent = {
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

export type GuaranteeReleasedEvent = {
    guarantor: Address;
    loanId: bigint;
    amount: bigint;
};

// Contract Constants
export const SACCO_CONSTANTS = {
    MINIMUM_SHARES: BigInt(10),
    SHARE_PRICE: BigInt('1000000000000000'), // 0.001 ETH
    SAVINGS_INTEREST_RATE: BigInt(5),
    LOAN_INTEREST_RATE: BigInt(10),
    SECONDS_PER_YEAR: BigInt(31536000), // 365 * 24 * 60 * 60
} as const;
