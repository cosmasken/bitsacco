import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatEther } from 'viem';
import { AlertCircle } from 'lucide-react';
import { SaccoQuickActions } from '../components/dashboard/SaccoQuickActions';
import { BoardManagement } from '../components/dashboard/BoardManagement';
import { PurchaseSharesModal } from '../components/modals/PurchaseSharesModal';
import { DepositSavingsModal } from '../components/modals/DepositSavingsModal';
import { RequestLoanModal } from '../components/modals/RequestLoanModal';
import { ProvideGuaranteeModal } from '../components/modals/ProvideGuaranteeModal';
import { useSacco, useSaccoMemberRegisteredEvent, useSaccoSharesPurchasedEvent, useSaccoSavingsDepositedEvent } from '../hooks/useSacco';
import { useTranslation } from 'react-i18next';
import { citreaTestnet } from '../wagmi';

export default function Dashboard() {
    const { t } = useTranslation();
    const { address, isConnected } = useAccount();
    const { useGetMemberInfo } = useSacco();
    // Get user balance with loading and error states
    const { 
        data: balance, 
        isLoading: balanceLoading, 
        error: balanceError,
        refetch: refetchBalance
    } = useBalance({
        address,
        chainId: citreaTestnet.id,
    });
    // Modal states
    const [isPurchaseSharesModalOpen, setIsPurchaseSharesModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isProvideGuaranteeModalOpen, setIsProvideGuaranteeModalOpen] = useState(false);
    // Overall loading and error states


    // Get member info
    const { data: memberInfo, refetch: refetchMemberInfo } = useGetMemberInfo(address!);

    // Listen for member registration events to refetch data
    useSaccoMemberRegisteredEvent(() => {
        refetchMemberInfo();
    });

    useSaccoSharesPurchasedEvent(() => {
        refetchMemberInfo();
        refetchBalance();
    });

    useSaccoSavingsDepositedEvent(() => {
        refetchMemberInfo();
        refetchBalance();
    });
    const isMember = memberInfo && memberInfo[0] > 0; // memberInfo[0] is shares
    const isActive = memberInfo ? memberInfo[3] : false; // memberInfo[3] is isActive
    const joinDate = memberInfo ? new Date(Number(memberInfo[2]) * 1000) : null; // memberInfo[2] is joinDate

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('sacco.dashboard.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {isMember 
                        ? t('sacco.dashboard.welcomeBack', { date: joinDate?.toLocaleDateString() })
                        : t('sacco.dashboard.purchaseSharesPrompt')
                    }
                </p>
            </div>

            {/* Connection Status */}
            {!isConnected && (
                <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                        {t('sacco.dashboard.connectWalletPrompt')}
                    </AlertDescription>
                </Alert>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
                <SaccoQuickActions 
                    onPurchaseShares={() => setIsPurchaseSharesModalOpen(true)}
                    onDepositSavings={() => setIsDepositModalOpen(true)}
                    onRequestLoan={() => setIsLoanModalOpen(true)}
                    onProvideGuarantee={() => setIsProvideGuaranteeModalOpen(true)}
                />
            </div>

            {/* Board Management */}
            <div className="mb-8">
                <BoardManagement />
            </div>

            {/* Modals */}
            <PurchaseSharesModal
                open={isPurchaseSharesModalOpen}
                onOpenChange={setIsPurchaseSharesModalOpen}
            />
            
            <DepositSavingsModal
                open={isDepositModalOpen}
                onOpenChange={setIsDepositModalOpen}
            />
            
            <RequestLoanModal
                open={isLoanModalOpen}
                onOpenChange={setIsLoanModalOpen}
            />
            
            <ProvideGuaranteeModal
                open={isProvideGuaranteeModalOpen}
                onOpenChange={setIsProvideGuaranteeModalOpen}
            />
        </div>
    );
}
