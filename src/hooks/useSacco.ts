import { Address } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { 
    SACCO_CONTRACT,
    SACCO_CONSTANTS
} from '../contracts/sacco-contract';
import { citreaTestnet } from '../wagmi';

export function useSacco() {
    const { address } = useAccount();

    // Read Functions - Member Info
    function useGetMemberInfo(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMemberInfo',
            args: [memberAddress],
        });
    }

    function useTotalShares() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getTotalShares',
        });
    }

    function useTotalSavings() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getTotalSavings',
        });
    }

    function useTotalProposals() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getTotalProposals',
        });
    }

    function useIsMemberActive(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'isMemberActive',
            args: [memberAddress],
        });
    }

    function useGetMemberSavings(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMemberSavings',
            args: [memberAddress],
        });
    }

    function useGetMemberShares(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMemberShares',
            args: [memberAddress],
        });
    }

    // Read Functions - Loans
    function useGetLoan(loanId: bigint) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getLoan',
            args: [loanId],
        });
    }

    function useGetMemberLoans(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMemberLoans',
            args: [memberAddress],
        });
    }

    function useGetMaxLoanAmount(memberAddress: Address) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getMaxLoanAmount',
            args: [memberAddress],
        });
    }

    function useGetLoanGuarantees(loanId: bigint) {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getLoanGuarantees',
            args: [loanId],
        });
    }

    function useNextLoanId() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getNextLoanId',
        });
    }

    // Write Functions - Member Management
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
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error purchasing shares:', err);
                throw err;
            }
        };

        return { purchaseShares, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useProposeMembership() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const proposeMembership = async (candidateAddress: Address) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'proposeMembership',
                    args: [candidateAddress],
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error proposing membership:', err);
                throw err;
            }
        };

        return { proposeMembership, hash, error, isPending, isConfirming, isConfirmed };
    }

    // Write Functions - Savings Management
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
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error depositing savings:', err);
                throw err;
            }
        };

        return { depositSavings, hash, error, isPending, isConfirming, isConfirmed };
    }

    function useWithdrawSavings() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const withdrawSavings = async (amount: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'withdrawSavings',
                    args: [amount],
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error withdrawing savings:', err);
                throw err;
            }
        };

        return { withdrawSavings, hash, error, isPending, isConfirming, isConfirmed };
    }

    // Write Functions - Loan Management
    function useRequestLoan() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const requestLoan = async (amount: bigint, duration: bigint) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'requestLoan',
                    args: [amount, duration],
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error requesting loan:', err);
                throw err;
            }
        };

        return { requestLoan, hash, error, isPending, isConfirming, isConfirmed };
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
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error providing guarantee:', err);
                throw err;
            }
        };

        return { provideGuarantee, hash, error, isPending, isConfirming, isConfirmed };
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
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error repaying loan:', err);
                throw err;
            }
        };

        return { repayLoan, hash, error, isPending, isConfirming, isConfirmed };
    }

    // Return all hooks
    return {
        // Read functions - Member Info
        useGetMemberInfo,
        useTotalShares,
        useTotalSavings,
        useTotalProposals,
        useIsMemberActive,
        useGetMemberSavings,
        useGetMemberShares,
        
        // Read functions - Loans
        useGetLoan,
        useGetMemberLoans,
        useGetMaxLoanAmount,
        useGetLoanGuarantees,
        useNextLoanId,
        
        // Write functions - Member Management
        usePurchaseShares,
        useProposeMembership,
        
        // Write functions - Savings Management
        useDepositSavings,
        useWithdrawSavings,
        
        // Write functions - Loan Management
        useRequestLoan,
        useProvideGuarantee,
        useRepayLoan,
    };
}
