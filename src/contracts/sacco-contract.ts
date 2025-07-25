import { Address } from 'viem';
import { TESTNET_CONFIG } from '../config';
import SACCOABI from '../abi/Sacco.json';

export const SACCO_CONTRACT = {
  address: TESTNET_CONFIG.smartContracts.sacco as Address,
  abi: SACCOABI,
} as const;

// Type-safe contract functions based on SACCO.sol
export type SaccoContractFunctions = {
  // Read functions
  registeredMembers: readonly [Address];
  savings: readonly [Address];
  proposals: readonly [bigint];
  votingPower: readonly [Address];
  hasVoted: readonly [bigint, Address];
  totalProposals: readonly [];
  votingDuration: readonly [];
  nextLoanId: readonly [];
  loanInterestRate: readonly [];
  owner: readonly [];
  loans: readonly [bigint];
  memberLoans: readonly [Address, bigint];
  memberAddresses: readonly [bigint];
  
  // Board-related read functions
  boardMembers: readonly [bigint];
  committeeBids: readonly [bigint];
  isBoardMember: readonly [Address];
  getBoardMembers: readonly [];
  getCommitteeBids: readonly [];
  getActiveBoardMembersCount: readonly [];
  getActiveBidsCount: readonly [];
  getBidVotes: readonly [bigint];
  hasVotedOnBidCheck: readonly [bigint, Address];

  // Write functions
  registerMember: readonly [Address];
  depositSavings: readonly [];
  requestLoan: readonly [bigint, bigint];
  repayLoan: readonly [bigint];
  penalizeLatePayment: readonly [bigint];
  distributeDividends: readonly [];
  createProposal: readonly [string];
  vote: readonly [bigint, boolean];
  executeProposal: readonly [bigint];
  
  // Board-related write functions
  submitCommitteeBid: readonly [string];
  voteOnCommitteeBid: readonly [bigint, bigint];
  removeBoardMember: readonly [Address];
};


