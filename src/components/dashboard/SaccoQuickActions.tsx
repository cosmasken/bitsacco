import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    PiggyBank, 
    CreditCard, 
    Shield, 
    Share, 
    Users,
    TrendingUp
} from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useSacco } from '@/hooks/useSacco';
import { useTranslation } from 'react-i18next';

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
    const { useGetMemberInfo } = useSacco();
    const { data: memberInfo } = useGetMemberInfo(address!);

    const isMember = memberInfo && memberInfo[0] > 0; // memberInfo[0] is shares
    const isActive = memberInfo ? memberInfo[3] : false; // memberInfo[3] is isActive

    return (
        <Card>
            <CardContent>
                <div className="space-y-2 mb-6 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Wallet Address</span>
                        <span className="font-mono text-sm truncate max-w-[200px] md:max-w-full">{address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Wallet Balance</span>
                        <span className="font-semibold">
                            {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Purchase Shares */}
                    <Button 
                        onClick={onPurchaseShares} 
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        variant={!isMember ? 'default' : 'outline'}
                        disabled={!address}
                    >
                        <Share className="w-6 h-6" />
                        <span>Purchase Shares</span>
                    </Button>
                    
                    {/* Deposit Savings */}
                    <Button 
                        onClick={onDepositSavings} 
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        variant="outline"
                        disabled={!address || !isMember || !isActive}
                    >
                        <PiggyBank className="w-6 h-6" />
                        <span>Deposit Savings</span>
                    </Button>
                    
                    {/* Request Loan */}
                    <Button 
                        onClick={onRequestLoan} 
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        variant="outline"
                        disabled={!address || !isMember || !isActive}
                    >
                        <CreditCard className="w-6 h-6" />
                        <span>Request Loan</span>
                    </Button>
                    
                    {/* Provide Guarantee */}
                    <Button 
                        onClick={onProvideGuarantee} 
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        variant="outline"
                        disabled={!address || !isMember || !isActive}
                    >
                        <Shield className="w-6 h-6" />
                        <span>Provide Guarantee</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
