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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';
import { useAccount } from 'wagmi';
import { ProposalType } from '@/contracts/sacco-contract';

interface CreateProposalModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProposalModal({ open, onOpenChange }: CreateProposalModalProps) {
    const { address } = useAccount();
    const { useCreateProposal, useGetMemberInfo } = useSacco();

    // Get member info to check eligibility
    const { data: memberInfo } = useGetMemberInfo(address!);
    const isMember = memberInfo && memberInfo[0] > 0; // shares
    const isActive = memberInfo ? memberInfo[3] : false; // isActive

    // Local state
    const [description, setDescription] = useState('');
    const [proposalType, setProposalType] = useState<ProposalType>(ProposalType.GENERAL);
    const [error, setError] = useState<string | null>(null);

    // Get create proposal function
    const { createProposal, isPending, isConfirming, isConfirmed } = useCreateProposal();

    const handleCreateProposal = async () => {
        try {
            setError(null);
            if (!description.trim()) {
                setError('Please enter a proposal description');
                return;
            }

            await createProposal(description, proposalType);
            
            if (isConfirmed) {
                setDescription('');
                setProposalType(ProposalType.GENERAL);
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error creating proposal:', err);
            setError(err instanceof Error ? err.message : 'Failed to create proposal');
        }
    };

    const proposalTypes = [
        { value: ProposalType.GENERAL, label: 'General' },
        { value: ProposalType.MEMBER_REGISTRATION, label: 'Member Registration' },
        { value: ProposalType.INTEREST_RATE_CHANGE, label: 'Interest Rate Change' },
        { value: ProposalType.DIVIDEND_DISTRIBUTION, label: 'Dividend Distribution' },
        { value: ProposalType.BOARD_MEMBER_ADDITION, label: 'Add Board Member' },
        { value: ProposalType.BOARD_MEMBER_REMOVAL, label: 'Remove Board Member' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Create Proposal</DialogTitle>
                    <DialogDescription>
                        Create a new governance proposal for the Sacco. All members can vote on proposals.
                    </DialogDescription>
                </DialogHeader>

                {!isMember || !isActive ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You must be an active member to create proposals.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="proposalType">Proposal Type</Label>
                            <Select
                                value={proposalType.toString()}
                                onValueChange={(value) => setProposalType(Number(value) as ProposalType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select proposal type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {proposalTypes.map((type) => (
                                        <SelectItem 
                                            key={type.value} 
                                            value={type.value.toString()}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Proposal Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your proposal..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <p className="text-sm text-gray-500">
                                Provide a clear description of what you're proposing
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
                                onClick={handleCreateProposal}
                                disabled={!description.trim() || isPending || isConfirming}
                            >
                                {isPending || isConfirming ? 'Creating...' : 'Create Proposal'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
