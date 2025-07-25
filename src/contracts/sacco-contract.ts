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

// Contract Events
export const SACCO_EVENTS = {
    // Member Events
    MemberRegistered: 'MemberRegistered',
    SharesPurchased: 'SharesPurchased',
    
    // Savings Events
    SavingsDeposited: 'SavingsDeposited',
    SavingsWithdrawn: 'SavingsWithdrawn',
    InterestPaid: 'InterestPaid',
    
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
    requestLoan: readonly [bigint, bigint]; // amount, duration
    repayLoan: readonly [bigint]; // loanId (payable)
    provideGuarantee: readonly [bigint]; // loanId (payable)
    
    // View Functions
    getLoan: readonly [bigint]; // loanId
    getMemberLoans: readonly [Address]; // member
    getMaxLoanAmount: readonly [Address]; // member
    getLoanGuarantees: readonly [bigint]; // loanId
    getNextLoanId: readonly [];
    getTotalShares: readonly [];
    getTotalSavings: readonly [];
    getTotalProposals: readonly [];
    isMemberActive: readonly [Address];
    getMemberSavings: readonly [Address];
    getMemberShares: readonly [Address];
};
