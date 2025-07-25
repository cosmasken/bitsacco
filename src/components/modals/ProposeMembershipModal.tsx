import React, { useState } from 'react';
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
import { isAddress } from 'viem';

interface ProposeMembershipModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProposeMembershipModal({ open, onOpenChange }: ProposeMembershipModalProps) {
    const { address } = useAccount();
    const { useProposeMembership, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive

    // Local state
    const [candidateAddress, setCandidateAddress] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Get propose membership function
    const { proposeMembership, isPending, isConfirming, isConfirmed } = useProposeMembership();

    const handleProposeMembership = async () => {
        try {
            setError(null);
            
            // Validate address
            if (!candidateAddress || !isAddress(candidateAddress)) {
                setError('Please enter a valid Ethereum address');
                return;
            }

            await proposeMembership(candidateAddress as `0x${string}`);
            
            if (isConfirmed) {
                setCandidateAddress('');
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error proposing membership:', err);
            setError(err instanceof Error ? err.message : 'Failed to propose membership');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Propose New Member</DialogTitle>
                    <DialogDescription>
                        Propose a new member to join the Sacco. The candidate will need to purchase shares once approved.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to propose new members.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Candidate Address</Label>
                            <Input
                                id="address"
                                placeholder="0x..."
                                value={candidateAddress}
                                onChange={(e) => setCandidateAddress(e.target.value)}
                            />
                            <p className="text-sm text-gray-500">
                                Enter the Ethereum address of the candidate
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
                                onClick={handleProposeMembership}
                                disabled={!candidateAddress || isPending || isConfirming}
                            >
                                {isPending || isConfirming ? 'Proposing...' : 'Propose Member'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
