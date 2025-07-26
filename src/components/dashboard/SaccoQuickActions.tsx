import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    PiggyBank, 
    CreditCard, 
    Shield, 
    Share, 
    Users,
    TrendingUp,
    Info,
    CheckCircle
} from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useSacco } from '@/hooks/useSacco';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SaccoQuickActions({
    onPurchaseShares,
    onDepositSavings,
    onRequestLoan,
    onProvideGuarantee
}: {
    onPurchaseShares: () => void;
    onDepositSavings: () => void;
    onRequestLoan: () => void;
    onProvideGuarantee: () => void;
}) {
    const { t } = useTranslation();
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });
    const { useGetMemberInfo, useSavings } = useSacco();
    const { data: memberInfo } = useGetMemberInfo(address!);
    const { data: savingsBalance } = useSavings(address!);

    const isMember = memberInfo && memberInfo[0] > 0; // memberInfo[0] is shares
    const isActive = memberInfo ? memberInfo[3] : false; // memberInfo[3] is isActive
    const shareCount = memberInfo ? Number(memberInfo[0]) : 0;
    const hasSavings = savingsBalance && Number(savingsBalance) > 0;

    const getActionState = (action: string) => {
        switch (action) {
            case 'shares':
                return {
                    disabled: !address,
                    variant: !isMember ? 'default' : 'outline',
                    tooltip: !address ? 'Connect your wallet first' : 
                            !isMember ? 'Become a member by purchasing shares' : 
                            'Purchase additional shares to increase voting power'
                };
            case 'savings':
                return {
                    disabled: !address || !isMember || !isActive,
                    variant: 'outline',
                    tooltip: !address ? 'Connect your wallet first' :
                            !isMember ? 'Purchase shares first to become a member' :
                            !isActive ? 'Your membership is not active' :
                            'Deposit savings to earn interest and qualify for loans'
                };
            case 'loan':
                return {
                    disabled: !address || !isMember || !isActive || !hasSavings,
                    variant: 'outline',
                    tooltip: !address ? 'Connect your wallet first' :
                            !isMember ? 'Purchase shares first to become a member' :
                            !isActive ? 'Your membership is not active' :
                            !hasSavings ? 'Deposit savings first to qualify for loans' :
                            'Request a loan backed by your savings'
                };
            case 'guarantee':
                return {
                    disabled: !address || !isMember || !isActive,
                    variant: 'outline',
                    tooltip: !address ? 'Connect your wallet first' :
                            !isMember ? 'Purchase shares first to become a member' :
                            !isActive ? 'Your membership is not active' :
                            'Provide guarantee for other members\' loans'
                };
            default:
                return { disabled: true, variant: 'outline', tooltip: '' };
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Sacco Actions
                </CardTitle>
                <CardDescription>
                    {!isMember 
                        ? "Start by purchasing shares to become a member"
                        : `Welcome back! You have ${shareCount} shares`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Member Status */}
                <div className="space-y-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Membership Status</span>
                        <Badge variant={isMember ? "default" : "secondary"}>
                            {isMember ? "Active Member" : "Not a Member"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Wallet Balance</span>
                        <span className="font-semibold">
                            {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}
                        </span>
                    </div>
                    {isMember && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Shares Owned</span>
                                <span className="font-semibold">{shareCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Savings Balance</span>
                                <span className="font-semibold">
                                    {savingsBalance ? `${Number(savingsBalance) / 100000000} cBTC` : '0 cBTC'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <TooltipProvider>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Purchase Shares */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={onPurchaseShares} 
                                    className="h-20 flex flex-col items-center justify-center gap-2 relative"
                                    variant={getActionState('shares').variant as any}
                                    disabled={getActionState('shares').disabled}
                                >
                                    <Share className="w-6 h-6" />
                                    <span>Purchase Shares</span>
                                    {!isMember && (
                                        <Badge className="absolute -top-1 -right-1 text-xs">Start Here</Badge>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{getActionState('shares').tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        {/* Deposit Savings */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={onDepositSavings} 
                                    className="h-20 flex flex-col items-center justify-center gap-2 relative"
                                    variant={getActionState('savings').variant as any}
                                    disabled={getActionState('savings').disabled}
                                >
                                    <PiggyBank className="w-6 h-6" />
                                    <span>Deposit Savings</span>
                                    {isMember && isActive && (
                                        <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{getActionState('savings').tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        {/* Request Loan */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={onRequestLoan} 
                                    className="h-20 flex flex-col items-center justify-center gap-2 relative"
                                    variant={getActionState('loan').variant as any}
                                    disabled={getActionState('loan').disabled}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <span>Request Loan</span>
                                    {hasSavings && (
                                        <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{getActionState('loan').tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        {/* Provide Guarantee */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={onProvideGuarantee} 
                                    className="h-20 flex flex-col items-center justify-center gap-2 relative"
                                    variant={getActionState('guarantee').variant as any}
                                    disabled={getActionState('guarantee').disabled}
                                >
                                    <Shield className="w-6 h-6" />
                                    <span>Provide Guarantee</span>
                                    {isMember && isActive && (
                                        <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{getActionState('guarantee').tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>

                {/* Progress Indicator */}
                {!isMember && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Getting Started
                            </span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            Purchase shares to become a member, then you can deposit savings and request loans.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
