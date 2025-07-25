import { Address } from 'viem';
import { TESTNET_CONFIG } from '../config';
import SaccoABI from '../abi/Sacco.json';

export const SACCO_CONTRACT = {
  address: TESTNET_CONFIG.smartContracts.sacco as Address,
  abi: SaccoABI,
} as const;

// Core Sacco Types
export type Member = {
  shares: bigint;
  savings: bigint;
  joinedAt: bigint;
  active: boolean;
};

export type Loan = {
  borrower: Address;
  amount: bigint;
  duration: bigint;
  interest: bigint;
  repaid: bigint;
  isActive: boolean;
  startTime: bigint;
};

export type Proposal = {
  description: string;
  proposer: Address;
  forVotes: bigint;
  againstVotes: bigint;
  executed: boolean;
  deadline: bigint;
};

// Type-safe contract functions based on Sacco.sol and its imported contracts
export type SaccoContractFunctions = {
  // Core Sacco Functions
  purchaseShares: readonly [bigint]; // shares (payable)
  depositSavings: readonly []; // payable
  
  // Member Management Functions
  isMember: readonly [Address]; // Returns boolean
  getMember: readonly [Address]; // Returns Member
  getTotalMembers: readonly []; // Returns number of members
  getMinimumShares: readonly []; // Returns minimum required shares
  getSharePrice: readonly []; // Returns current share price
  
  // Loan Functions
  requestLoan: readonly [bigint, bigint]; // amount, duration
  repayLoan: readonly [bigint]; // loanId (payable)
  getLoan: readonly [bigint]; // loanId returns Loan
  getUserLoans: readonly [Address]; // Returns array of loan IDs
  getTotalLoans: readonly []; // Returns number of loans
  
  // Governance Functions
  createProposal: readonly [string]; // description
  voteOnProposal: readonly [bigint, boolean]; // proposalId, support
  executeProposal: readonly [bigint]; // proposalId
  getProposal: readonly [bigint]; // Returns Proposal
  getTotalProposals: readonly []; // Returns number of proposals
  
  // Dividend Functions
  distributeDividends: readonly []; // Only callable by governance
  getDividendShare: readonly [Address]; // Returns member's dividend share
  getTotalDividends: readonly []; // Returns total distributed dividends
  
  // Savings Functions
  getSavingsBalance: readonly [Address]; // Returns member's savings
  getTotalSavings: readonly []; // Returns total savings in contract
  withdrawSavings: readonly [bigint]; // amount (requires approval)
};

// Event types based on all Sacco contracts
export type MemberJoinedEvent = {
  member: Address;
  shares: bigint;
  timestamp: bigint;
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

export type LoanRequestedEvent = {
  borrower: Address;
  loanId: bigint;
  amount: bigint;
  duration: bigint;
};

export type LoanRepaidEvent = {
  borrower: Address;
  loanId: bigint;
  amount: bigint;
};

export type ProposalCreatedEvent = {
  proposalId: bigint;
  proposer: Address;
  description: string;
  deadline: bigint;
};

export type VoteCastEvent = {
  proposalId: bigint;
  voter: Address;
  support: boolean;
  weight: bigint;
};

export type ProposalExecutedEvent = {
  proposalId: bigint;
  executed: boolean;
};

export type DividendsDistributedEvent = {
  totalAmount: bigint;
  timestamp: bigint;
};

// Constants from the contracts
export const SACCO_CONSTANTS = {
  MINIMUM_SHARES: BigInt(100), // Minimum shares required for membership
  SHARE_PRICE: BigInt(1e16), // 0.01 ETH per share
  LOAN_INTEREST_RATE: 5, // 5% interest rate
  MAX_LOAN_DURATION: 12, // 12 months
  VOTING_PERIOD: 7 * 24 * 60 * 60, // 7 days in seconds
  DIVIDEND_LOCK_PERIOD: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;
