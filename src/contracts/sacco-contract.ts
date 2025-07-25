import { Address } from 'viem';
import { TESTNET_CONFIG } from '../config';
import SaccoABI from '../abi/Sacco.json';

// Re-export all types
export * from './sacco-types';

// Contract configuration
export const SACCO_CONTRACT = {
    address: TESTNET_CONFIG.smartContracts.sacco as Address,
    abi: SaccoABI,
} as const;

// Contract Constants
export const SACCO_CONSTANTS = {
    MINIMUM_SHARES: BigInt(10),
    SHARE_PRICE: BigInt('1000000000000000'), // 0.001 ETH
    SAVINGS_INTEREST_RATE: BigInt(5), // 5% per annum
    LOAN_INTEREST_RATE: BigInt(10), // 10% per annum
    SECONDS_PER_YEAR: BigInt(31536000), // 365 * 24 * 60 * 60
    DIVIDEND_DISTRIBUTION_THRESHOLD: BigInt(50),
} as const;

// Contract Events
export const SACCO_EVENTS = {
    // Member Events
    MemberRegistered: 'MemberRegistered',
    SharesPurchased: 'SharesPurchased',
    MembershipProposed: 'MembershipProposed',
    
    // Savings Events
    SavingsDeposited: 'SavingsDeposited',
    InterestCalculated: 'InterestCalculated',
    DividendDistributed: 'DividendDistributed',
    
    // Loan Events
    LoanRequested: 'LoanRequested',
    GuaranteeProvided: 'GuaranteeProvided',
    LoanIssued: 'LoanIssued',
    LoanRepaid: 'LoanRepaid',
    GuaranteeReleased: 'GuaranteeReleased',
} as const;

// Contract Function Types
export type SaccoContractFunctions = {
    // Member Management
    purchaseShares: readonly [bigint]; // shares (payable)
    proposeMembership: readonly [Address]; // candidate
    getMemberInfo: readonly [Address]; // member address
    
    // Savings Management
    depositSavings: readonly []; // payable
    withdrawSavings: readonly [bigint]; // amount
    calculateInterestForAllMembers: readonly [];
    distributeDividends: readonly [];
    
    // Loan Management
    requestLoan: readonly [bigint, bigint, string]; // amount, duration, purpose
    repayLoan: readonly [bigint]; // loanId (payable)
    provideGuarantee: readonly [bigint]; // loanId (payable)
    getLoan: readonly [bigint]; // loanId
    getMemberLoans: readonly [Address]; // member
    getMaxLoanAmount: readonly [Address]; // member
    getLoanGuarantees: readonly [bigint]; // loanId
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

export type InterestCalculatedEvent = {
    member: Address;
    amount: bigint;
};

export type DividendDistributedEvent = {
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
