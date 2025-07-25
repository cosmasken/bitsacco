import React, { useState } from 'react';
import { parseEther } from 'viem';
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
import { AlertCircle } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';
import { useAccount } from 'wagmi';

interface RequestLoanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RequestLoanModal({ open, onOpenChange }: RequestLoanModalProps) {
    const { address } = useAccount();
    const { useRequestLoan, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive

    // Local state
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('30'); // 30 days default
    const [error, setError] = useState<string | null>(null);

    // Get loan request function
    const { requestLoan, isPending, isConfirming, isConfirmed } = useRequestLoan();

    const handleRequestLoan = async () => {
        try {
            setError(null);
            if (!amount || !duration) {
                setError('Please fill in all fields');
                return;
            }

            const amountInWei = parseEther(amount);
            const durationInSeconds = BigInt(parseInt(duration) * 24 * 60 * 60); // Convert days to seconds

            await requestLoan(amountInWei, durationInSeconds);
            
            if (isConfirmed) {
                setAmount('');
                setDuration('30');
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error requesting loan:', err);
            setError(err instanceof Error ? err.message : 'Failed to request loan');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Loan</DialogTitle>
                    <DialogDescription>
                        Request a loan from the Sacco. The loan amount is subject to your savings and membership duration.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to request a loan.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Loan Amount (BTC)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                min="0.000001"
                                placeholder="0.0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (Days)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="30"
                                max="365"
                                placeholder="30"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                            <p className="text-sm text-gray-500">
                                Minimum 30 days, maximum 365 days
                            </p>
                        </div>

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
                                disabled={isPending || isConfirming}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRequestLoan}
                                disabled={!amount || !duration || isPending || isConfirming}
                            >
                                {isPending || isConfirming ? 'Requesting...' : 'Request Loan'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
