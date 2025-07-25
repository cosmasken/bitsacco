import { Address } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { 
    SACCO_CONTRACT,
    SACCO_CONSTANTS,
    ProposalType
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

    function useTotalProposals() {
        return useReadContract({
            ...SACCO_CONTRACT,
            functionName: 'getTotalProposals',
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

    // Legacy function for backward compatibility
    function useRegisterMember() {
        const { writeContract, data: hash, error, isPending } = useWriteContract();
        const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

        const registerMember = async (memberAddress: Address) => {
            if (!address) throw new Error('Wallet not connected');
            
            try {
                await writeContract({
                    ...SACCO_CONTRACT,
                    functionName: 'purchaseShares',
                    args: [SACCO_CONSTANTS.MINIMUM_SHARES],
                    value: SACCO_CONSTANTS.MINIMUM_SHARES * SACCO_CONSTANTS.SHARE_PRICE,
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error registering member:', err);
                throw err;
            }
        };

        return { registerMember, hash, error, isPending, isConfirming, isConfirmed };
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

    // Write Functions - Governance
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
                    chain: citreaTestnet,
                    account: address,
                });
            } catch (err) {
                console.error('Error creating proposal:', err);
                throw err;
            }
        };

        return { createProposal, hash, error, isPending, isConfirming, isConfirmed };
    }

    // Return all hooks
    return {
        // Read functions
        useGetMemberInfo,
        useTotalProposals,
        
        // Write functions - Member Management
        usePurchaseShares,
        useProposeMembership,
        useRegisterMember,
        
        // Write functions - Savings Management
        useDepositSavings,
        
        // Write functions - Loan Management
        useRequestLoan,
        useProvideGuarantee,
        
        // Write functions - Governance
        useCreateProposal,
    };
}
