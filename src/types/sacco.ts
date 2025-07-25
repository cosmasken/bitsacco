
export interface Member {
  shares: bigint;
  savings: bigint;
  lastInterestUpdate: bigint;
  joinDate: bigint;
  isActive: boolean;
  totalLoansReceived: bigint;
  guaranteeCapacity: bigint;
}

export interface Proposal {
  description: string;
  deadline: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  executed: boolean;
  proposer: string;
  proposalType: bigint;
  targetMember: string;
}

export interface Loan {
  amount: bigint;
  repaymentAmount: bigint;
  duration: bigint;
  startTime: bigint;
  nextRepaymentTime: bigint;
  repaidAmount: bigint;
  repaid: boolean;
  borrower: string;
  guaranteeRequired: bigint;
  guaranteeProvided: bigint;
}

export interface BoardMember {
  memberAddress: string;
  appointedDate: bigint;
  votes: bigint;
  isActive: boolean;
}

export interface CommitteeBid {
  bidder: string;
  proposal: string;
  bidAmount: bigint;
  submissionDate: bigint;
  votes: bigint;
  isActive: boolean;
}
