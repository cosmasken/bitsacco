import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PurchaseSharesModal } from '../components/modals/PurchaseSharesModal';
import { ProposeMembershipModal } from '../components/modals/ProposeMembershipModal';
import { DepositSavingsModal } from '../components/modals/DepositSavingsModal';
import { RequestLoanModal } from '../components/modals/RequestLoanModal';
import { ProvideGuaranteeModal } from '../components/modals/ProvideGuaranteeModal';
import { CreateProposalModal } from '../components/modals/CreateProposalModal';
import { BoardManagement } from '../components/dashboard/BoardManagement';
import { useSacco } from '../hooks/useSacco';
import { useAccount } from 'wagmi';
import { 
  Loader2, UserPlus, Wallet, CreditCard, FileText, Vote, 
  TrendingUp, Share, Shield, AlertCircle, PiggyBank,
  ArrowUpRight, ArrowDownRight, Users, Building2, ChartBar
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPurchaseSharesModalOpen, setIsPurchaseSharesModalOpen] = useState(false);
  const [isProposeMembershipModalOpen, setIsProposeMembershipModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isProvideGuaranteeModalOpen, setIsProvideGuaranteeModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const { 
    useTotalProposals, 
    useNextLoanId, 
    useLoanInterestRate, 
    useOwner,
    useGetMemberInfo,
    useMinimumShares,
    useSharePrice,
    useSavings,
  } = useSacco();

  const { data: totalProposals, isLoading: isLoadingTotalProposals } = useTotalProposals();
  const { data: nextLoanId, isLoading: isLoadingNextLoanId } = useNextLoanId();
  const { data: loanInterestRate, isLoading: isLoadingLoanInterestRate } = useLoanInterestRate();
  const { data: owner, isLoading: isLoadingOwner } = useOwner();
  const { data: memberInfo } = useGetMemberInfo(address!);
  const { data: minimumShares } = useMinimumShares();
  const { data: sharePrice } = useSharePrice();
  const { data: memberSavings } = useSavings(address!);

  // Check membership status
  const isMember = memberInfo && memberInfo[0] > 0;
  const memberShares = memberInfo ? String(memberInfo[0]) : '0';
  const isActive = memberInfo ? memberInfo[3] : false;
  const joinDate = memberInfo ? new Date(Number(memberInfo[2]) * 1000) : null;

  // Mock data for demonstration (replace with real data from smart contract)
  const recentTransactions = [
    { type: 'Deposit', amount: '0.001', date: '2024-07-24', status: 'Completed' },
    { type: 'Dividend', amount: '0.0005', date: '2024-07-23', status: 'Completed' },
    { type: 'Loan Payment', amount: '0.002', date: '2024-07-22', status: 'Completed' },
  ];

  const loanHistory = [
    { id: 1, amount: '0.05', status: 'Active', dueDate: '2024-08-25', remainingBalance: '0.03' },
    { id: 2, amount: '0.03', status: 'Repaid', dueDate: '2024-06-15', remainingBalance: '0' },
  ];

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">SACCO Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isMember 
                ? `Member since ${joinDate?.toLocaleDateString()}`
                : 'Purchase shares to become a SACCO member'
              }
            </p>
          </div>
          {isMember && (
            <div className="flex gap-2">
              <Button onClick={() => setIsDepositModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                <PiggyBank className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button onClick={() => setIsLoanModalOpen(true)} variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Membership Status Alerts */}
      {!isConnected ? (
        <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            Please connect your wallet to access SACCO features.
          </AlertDescription>
        </Alert>
      ) : !isMember ? (
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <div className="flex items-center justify-between">
              <span>
                Purchase {minimumShares ? String(minimumShares) : '1'} shares (${sharePrice ? String(sharePrice) : '0'} BTC each) to join.
              </span>
              <Button 
                onClick={() => setIsPurchaseSharesModalOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Buy Shares
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Main Dashboard Content */}
      {isMember && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {memberSavings ? String(memberSavings) : '0'} BTC
                    </span>
                    <span className="text-sm text-green-500">+2.5%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Savings + Shares</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Shares Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {memberShares} Shares
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Worth {Number(memberShares) * (Number(sharePrice) || 0)} BTC
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Available Credit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(Number(memberSavings) * 3 || 0).toFixed(8)} BTC
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">3x Your Savings</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Year-to-Date Dividends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {'0'} BTC
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Next Payout in 14 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-gray-800 mb-8">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount (BTC)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{tx.type}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {tx.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Savings Tab */}
          <TabsContent value="savings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Savings Overview</CardTitle>
                  <CardDescription>Your savings activity and growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Balance</p>
                      <p className="text-2xl font-bold">{'0'} BTC</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-2xl font-bold">4.5% APY</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={() => setIsDepositModalOpen(true)} className="w-full">
                      <PiggyBank className="w-4 h-4 mr-2" />
                      Make a Deposit
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Withdraw Savings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Savings Goals</CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Emergency Fund</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Investment Goal</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Loan Overview</CardTitle>
                  <CardDescription>Your active loans and payment schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Amount (BTC)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Remaining</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanHistory.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>#{loan.id}</TableCell>
                          <TableCell>{loan.amount}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              loan.status === 'Active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {loan.status}
                            </span>
                          </TableCell>
                          <TableCell>{loan.dueDate}</TableCell>
                          <TableCell>{loan.remainingBalance} BTC</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 space-y-2">
                    <Button onClick={() => setIsLoanModalOpen(true)} className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Apply for New Loan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Make Loan Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Loan Eligibility</CardTitle>
                  <CardDescription>Your borrowing capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Maximum Loan Amount</p>
                      <p className="text-2xl font-bold">
                        {(Number(memberSavings) * 3 || 0).toFixed(8)} BTC
                      </p>
                      <p className="text-xs text-gray-500">Based on your savings</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Rate</p>
                      <p className="text-2xl font-bold">{'7.5'}%</p>
                      <p className="text-xs text-gray-500">Annual interest rate</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Term Options</p>
                      <p className="text-sm">3 months - 24 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Active Proposals</CardTitle>
                  <CardDescription>Current items requiring member votes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample proposals - replace with real data */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Increase Loan Limits</h4>
                          <p className="text-sm text-gray-500">Proposal to increase maximum loan amounts by 50%</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Voting Open
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Yes: 65%</span>
                          <span>No: 35%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="flex-1">Vote Yes</Button>
                          <Button size="sm" variant="outline" className="flex-1">Vote No</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setIsProposalModalOpen(true)} className="w-full mt-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Proposal
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Your Voting Power</CardTitle>
                    <CardDescription>Based on your shares</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{memberShares} votes</div>
                    <p className="text-sm text-gray-500">1 share = 1 vote</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Governance Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Proposals</p>
                      <p className="text-xl font-bold">{'0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Your Participation</p>
                      <p className="text-xl font-bold">85%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      <PurchaseSharesModal
        open={isPurchaseSharesModalOpen}
        onOpenChange={setIsPurchaseSharesModalOpen}
      />
      
      <ProposeMembershipModal
        open={isProposeMembershipModalOpen}
        onOpenChange={setIsProposeMembershipModalOpen}
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
      
      <CreateProposalModal
        open={isProposalModalOpen}
        onOpenChange={setIsProposalModalOpen}
      />
    </div>
  );
};
