import { Address } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useAccount } from 'wagmi';
import { 
    SACCO_CONTRACT,
    SACCO_EVENTS,
    Member,
    BoardMember,
    CommitteeBid,
    Proposal,
    Loan,
    ProposalType,
    SACCO_CONSTANTS
} from '../contracts/sacco-contract';
import { citreaTestnet } from '../wagmi';

export function useSacco() {
    const { address } = useAccount();

    // Read Functions
    function useGetMemberInfo(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMemberInfo',
            args: [memberAddress],
        });
    }

    function useMemberLoans(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'memberLoans',
            args: [memberAddress],
        });
    }

    function useLoan(loanId: bigint) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'loans',
            args: [loanId],
        });
    }

    function useTotalProposals() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'totalProposals',
        });
    }

    function useNextLoanId() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'nextLoanId',
        });
    }

    function useLoanInterestRate() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'LOAN_INTEREST_RATE',
        });
    }

    function useMinimumShares() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'MINIMUM_SHARES',
        });
    }

    function useSharePrice() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'SHARE_PRICE',
        });
    }

    function useGetBoardMembers() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getBoardMembers',
        });
    }

    function useGetLoanGuarantees(loanId: bigint) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getLoanGuarantees',
            args: [loanId],
        });
    }

    function useGetMaxLoanAmount(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMaxLoanAmount',
            args: [memberAddress],
        });
    }

    function useGetCommitteeBids() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getCommitteeBids',
        });
    }

    function useGetActiveBoardMembersCount() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getActiveBoardMembersCount',
        });
    }

    // Write Functions
    function usePurchaseShares() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const purchaseShares = async (shares: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'purchaseShares',
                    args: [shares],
                    value: shares * SACCO_CONSTANTS.SHARE_PRICE,
                });
            } catch (err) {
                console.error('Error purchasing shares:', err);
                throw err;
            }
        };

        return { purchaseShares, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useDepositSavings() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const depositSavings = async (amount: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'depositSavings',
                    value: amount,
                });
            } catch (err) {
                console.error('Error depositing savings:', err);
                throw err;
            }
        };

        return { depositSavings, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useRequestLoan() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const requestLoan = async (amount: bigint, duration: bigint, purpose: string = '') => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'requestLoan',
                    args: [amount, duration, purpose],
                });
            } catch (err) {
                console.error('Error requesting loan:', err);
                throw err;
            }
        };

        return { requestLoan, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useRepayLoan() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const repayLoan = async (loanId: bigint, amount: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'repayLoan',
                    args: [loanId],
                    value: amount,
                });
            } catch (err) {
                console.error('Error repaying loan:', err);
                throw err;
            }
        };

        return { repayLoan, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useProvideGuarantee() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const provideGuarantee = async (loanId: bigint, amount: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'provideGuarantee',
                    args: [loanId],
                    value: amount,
                });
            } catch (err) {
                console.error('Error providing guarantee:', err);
                throw err;
            }
        };

        return { provideGuarantee, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useCreateProposal() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const createProposal = async (description: string, proposalType: ProposalType) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'createProposal',
                    args: [description, proposalType],
                });
            } catch (err) {
                console.error('Error creating proposal:', err);
                throw err;
            }
        };

        return { createProposal, hash, error, isPending, isConfirming, isConfirmed };
    }

    return {
        // Read functions
        useGetMemberInfo,
        useMemberLoans,
        useLoan,
        useTotalProposals,
        useNextLoanId,
        useLoanInterestRate,
        useMinimumShares,
        useSharePrice,
        useGetBoardMembers,
        useGetLoanGuarantees,
        useGetMaxLoanAmount,
        useGetCommitteeBids,
        useGetActiveBoardMembersCount,

        // Write functions
        usePurchaseShares,
        useDepositSavings,
        useRequestLoan,
        useRepayLoan,
        useProvideGuarantee,
        useCreateProposal,
    };
}
