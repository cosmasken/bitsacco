import React from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Vote, Crown } from 'lucide-react';
import { useSacco } from '@/hooks/useSacco';

export function BoardManagement() {
    const { address } = useAccount();
    const { 
        useGetMemberInfo,
        useTotalProposals,
    } = useSacco();

    // Contract read hooks
    const { data: memberInfo, isLoading: loadingMember } = useGetMemberInfo(address!);
    const { data: totalProposals, isLoading: loadingProposals } = useTotalProposals();

    // Parse member info
    const shares = memberInfo ? memberInfo[0] : BigInt(0); // shares
    const savings = memberInfo ? memberInfo[1] : BigInt(0); // savings
    const joinDate = memberInfo ? new Date(Number(memberInfo[2]) * 1000) : null; // joinDate
    const isActive = memberInfo ? memberInfo[3] : false; // isActive
    const isMember = shares > 0;

    if (loadingMember) {
        return <div>Loading member information...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Board Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Sacco Overview
                    </CardTitle>
                    <CardDescription>
                        Your membership status and governance overview
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatEther(shares)}
                            </div>
                            <div className="text-sm text-gray-600">Your Shares</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {formatEther(savings)}
                            </div>
                            <div className="text-sm text-gray-600">Your Savings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {loadingProposals ? '...' : totalProposals?.toString() || '0'}
                            </div>
                            <div className="text-sm text-gray-600">Total Proposals</div>
                        </div>
                    </div>

                    {/* Membership Status */}
                    {isMember && (
                        <div className="space-y-3">
                            <h4 className="font-semibold">Your Membership</h4>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                    <div>
                                        <div className="font-medium">
                                            {isActive ? 'Active Member' : 'Inactive Member'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Member since: {joinDate?.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={isActive ? 'default' : 'destructive'}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Governance Overview */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-3">Governance Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {loadingProposals ? '...' : totalProposals?.toString() || '0'}
                                </div>
                                <div className="text-sm text-gray-600">Total Proposals</div>
                            </div>
                            <div className="p-4 border rounded-lg text-center">
                                <div className="text-2xl font-bold text-indigo-600">
                                    {formatEther(shares)}
                                </div>
                                <div className="text-sm text-gray-600">Voting Power</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Member Status Alert */}
            {!isMember && (
                <Alert>
                    <Vote className="h-4 w-4" />
                    <AlertDescription>
                        Purchase shares to become a member and participate in Sacco governance.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
