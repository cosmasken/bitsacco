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
import { AlertCircle, Shield } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';
import { useAccount } from 'wagmi';

interface ProvideGuaranteeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProvideGuaranteeModal({ open, onOpenChange }: ProvideGuaranteeModalProps) {
    const { address } = useAccount();
    const { useProvideGuarantee, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive
    const guaranteeCapacity = memberInfo ? memberInfo[5] : BigInt(0); // guaranteeCapacity

    // Local state
    const [loanId, setLoanId] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Get provide guarantee function
    const { provideGuarantee, isPending, isConfirming, isConfirmed } = useProvideGuarantee();

    const handleProvideGuarantee = async () => {
        try {
            setError(null);
            if (!loanId || !amount) {
                setError('Please fill in all fields');
                return;
            }

            if (parseFloat(amount) <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            const guaranteeAmount = parseEther(amount);
            if (guaranteeAmount > guaranteeCapacity) {
                setError('Amount exceeds your guarantee capacity');
                return;
            }

            await provideGuarantee(BigInt(loanId), guaranteeAmount);
            
            if (isConfirmed) {
                setLoanId('');
                setAmount('');
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error providing guarantee:', err);
            setError(err instanceof Error ? err.message : 'Failed to provide guarantee');
        }
    };

    const isProcessing = isPending || isConfirming;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Provide Loan Guarantee
                    </DialogTitle>
                    <DialogDescription>
                        Guarantee another member's loan. Your guarantee helps other members access loans.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to provide guarantees.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {/* Guarantee Capacity Display */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Available Guarantee Capacity
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatEther(guaranteeCapacity)} BTC
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="loanId">Loan ID</Label>
                            <Input
                                id="loanId"
                                type="number"
                                min="0"
                                placeholder="Enter loan ID"
                                value={loanId}
                                onChange={(e) => setLoanId(e.target.value)}
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Guarantee Amount (BTC)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                min="0.000001"
                                max={formatEther(guaranteeCapacity)}
                                placeholder="0.0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isProcessing}
                            />
                            <p className="text-sm text-gray-500">
                                Maximum amount: {formatEther(guaranteeCapacity)} BTC
                            </p>
                        </div>

                        {/* Guarantee Info */}
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                Your guarantee will be locked until the loan is fully repaid. Make sure you trust the borrower.
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
                                onClick={handleProvideGuarantee}
                                disabled={!loanId || !amount || parseFloat(amount) <= 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    isConfirming ? 'Confirming...' : 'Providing Guarantee...'
                                ) : (
                                    'Provide Guarantee'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
