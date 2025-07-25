import { useSacco } from '../hooks/useSaccwo';
import { useAccount } from 'wagmi';

export function useVerifyContract() {
    const { address } = useAccount();
    const { 
        useGetMemberInfo,
        useTotalShares,
        useTotalSavings
    } = useSacco();

    // Get contract info
    const { data: memberInfo } = useGetMemberInfo(address!);
    const { data: totalShares } = useTotalShares();
    const { data: totalSavings } = useTotalSavings();

    const isContractDeployed = memberInfo !== undefined;
    
    return {
        isDeployed: isContractDeployed,
        contractAddress: '0x3ec19d21e7E003565ed600Cc078F116fDEe4c6f2',
        memberInfo,
        totalShares,
        totalSavings
    };
}
