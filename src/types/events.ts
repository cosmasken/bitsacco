
export interface MemberRegisteredEvent {
  member: string;
  shares: bigint;
}

export interface SavingsDepositedEvent {
  member: string;
  amount: bigint;
}

export interface LoanIssuedEvent {
  borrower: string;
  loanId: bigint;
  amount: bigint;
}

export interface LoanRepaidEvent {
  borrower: string;
  loanId: bigint;
  amount: bigint;
}

export interface DividendPaidEvent {
  member: string;
  amount: bigint;
}

export interface BoardMemberAddedEvent {
  member: string;
  votes: bigint;
}

export interface BoardMemberRemovedEvent {
  member: string;
}

export interface CommitteeBidSubmittedEvent {
  bidder: string;
  bidId: bigint;
  amount: bigint;
}

export interface CommitteeBidVotedEvent {
  voter: string;
  bidId: bigint;
  votes: bigint;
}

export interface CommitteeBidAcceptedEvent {
  bidder: string;
  bidId: bigint;
}
