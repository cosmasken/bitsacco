import React, { useState } from 'react';
import { parseEther, formatEther } from 'viem';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, PiggyBank } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';
import { useAccount } from 'wagmi';

interface DepositSavingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DepositSavingsModal({ open, onOpenChange }: DepositSavingsModalProps) {
    const { address } = useAccount();
    const { useDepositSavings, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive
    const currentSavings = memberInfo ? memberInfo[1] : BigInt(0); // savings

    // Local state
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Get deposit savings function
    const { depositSavings, isPending, isConfirming, isConfirmed } = useDepositSavings();

    const handleDeposit = async () => {
        try {
            setError(null);
            if (!amount || parseFloat(amount) <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            const depositAmount = parseEther(amount);
            await depositSavings(depositAmount);
            
            if (isConfirmed) {
                setAmount('');
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error depositing savings:', err);
            setError(err instanceof Error ? err.message : 'Failed to deposit savings');
        }
    };

    const isProcessing = isPending || isConfirming;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PiggyBank className="h-5 w-5" />
                        Deposit Savings
                    </DialogTitle>
                    <DialogDescription>
                        Add to your savings in the Sacco. Your savings earn interest and increase your loan limit.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to deposit savings.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {/* Current Savings Display */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Current Savings
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatEther(currentSavings)} BTC
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Deposit Amount (BTC)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                min="0.000001"
                                placeholder="0.0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isProcessing}
                            />
                            <p className="text-sm text-gray-500">
                                Minimum deposit: 0.000001 BTC
                            </p>
                        </div>

                        {/* Interest Rate Info */}
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                Your savings earn 5% APY interest, calculated and compounded daily.
                            </AlertDescription>
                        </Alert>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeposit}
                                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    isConfirming ? 'Confirming...' : 'Depositing...'
                                ) : (
                                    'Deposit Savings'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
