import React, { useState } from 'react';
import { isAddress, formatEther } from 'viem';
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
import { AlertCircle, UserPlus } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';
import { useAccount } from 'wagmi';
import { SACCO_CONSTANTS } from '@/contracts/sacco-contract';

interface RegisterMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RegisterMemberModal({ open, onOpenChange }: RegisterMemberModalProps) {
    const { address } = useAccount();
    const { useRegisterMember, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive

    // Local state
    const [memberAddress, setMemberAddress] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Get register member function
    const { registerMember, isPending, isConfirming, isConfirmed } = useRegisterMember();

    const handleRegisterMember = async () => {
        try {
            setError(null);
            
            // Validate address
            if (!memberAddress || !isAddress(memberAddress)) {
                setError('Please enter a valid Ethereum address');
                return;
            }

            // Check if registering self
            if (memberAddress.toLowerCase() === address?.toLowerCase()) {
                setError('Cannot register yourself');
                return;
            }

            await registerMember(memberAddress as `0x${string}`);
            
            if (isConfirmed) {
                setMemberAddress('');
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error registering member:', err);
            setError(err instanceof Error ? err.message : 'Failed to register member');
        }
    };

    const isProcessing = isPending || isConfirming;
    const registrationCost = SACCO_CONSTANTS.MINIMUM_SHARES * SACCO_CONSTANTS.SHARE_PRICE;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Register New Member
                    </DialogTitle>
                    <DialogDescription>
                        Register a new member to the Sacco. This will purchase the minimum required shares for them.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to register new members.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {/* Registration Cost Info */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Registration Cost
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatEther(registrationCost)} BTC
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {String(SACCO_CONSTANTS.MINIMUM_SHARES)} shares at {formatEther(SACCO_CONSTANTS.SHARE_PRICE)} BTC each
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="memberAddress">Member Address</Label>
                            <Input
                                id="memberAddress"
                                placeholder="0x..."
                                value={memberAddress}
                                onChange={(e) => setMemberAddress(e.target.value)}
                                disabled={isProcessing}
                            />
                            <p className="text-sm text-gray-500">
                                Enter the Ethereum address of the new member
                            </p>
                        </div>

                        {/* Registration Info */}
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                This will purchase the minimum required shares for the new member. Make sure you have their permission.
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
                                onClick={handleRegisterMember}
                                disabled={!memberAddress || isProcessing}
                            >
                                {isProcessing ? (
                                    isConfirming ? 'Confirming...' : 'Registering...'
                                ) : (
                                    'Register Member'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
