import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  Bitcoin, 
  Users, 
  Shield, 
  TrendingUp, 
  ArrowRight,
  Wallet,
  PiggyBank,
  HandshakeIcon,
  Vote,
  Building,
  ChartBar,
  Coins
} from 'lucide-react';
import { useConnect } from 'wagmi';

export const LandingPage: React.FC = () => {
  const { connect, connectors, isPending, error } = useConnect();
  const handleConnect = () => {
    // Connect with the first available connector (usually injected/MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };


  // const handleConnect = async () => {
  //   // Try to find an injected connector first (MetaMask)
  //   const injectedConnector = connectors.find(c => c.id === 'injected');
  //   const web3AuthConnector = connectors.find(c => c.id === 'web3Auth');
    
  //   // Prefer injected connector if available, fallback to Web3Auth if available
  //   const connector = injectedConnector || web3AuthConnector || connectors[0];
    
  //   if (connector) {
  //     try {
  //       await connect({ connector });
  //     } catch (err) {
  //       console.error('Connection error:', err);
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BitSacco</h1>
              </div>
            </div>

            {/* Hero Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Modern Bitcoin
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                Savings & Credit Society
              </span>
            </h2>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join a decentralized financial cooperative. Save in Bitcoin, access loans, earn dividends, and participate in governance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleConnect}
                disabled={isPending}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {isPending ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 transition-colors"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Smart Contract Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span>Bitcoin Native</span>
              </div>
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4" />
                <span>Member Governed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Future of Cooperative Finance
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the power of traditional Sacco principles enhanced by blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Bitcoin Savings
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Build your wealth in Bitcoin with regular savings. Earn competitive dividends from society profits.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HandshakeIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Secured Lending
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Access Bitcoin-backed loans with competitive interest rates. No traditional credit checks needed.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  DAO Governance
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Participate in decision-making through secure on-chain voting. True member-owned cooperation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Getting Started
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join the financial cooperative of the future in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Purchase Shares
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Buy membership shares to join the Sacco
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start Saving
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Make regular Bitcoin deposits to your savings account
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Access Services
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Apply for loans and participate in governance
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Earn Returns
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Receive dividends from Sacco profits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">₿2.5M</div>
              <div className="text-gray-600 dark:text-gray-300">Total Assets</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">12%</div>
              <div className="text-gray-600 dark:text-gray-300">Avg. APY</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">₿500k</div>
              <div className="text-gray-600 dark:text-gray-300">Loans Issued</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6">
                <ChartBar className="w-16 h-16 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Competitive Returns
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Earn attractive dividends from lending operations and investment returns
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6">
                <Coins className="w-16 h-16 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Bitcoin-Native
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                All operations conducted in Bitcoin, protected by blockchain security
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6">
                <Users className="w-16 h-16 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Community Owned
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                True member ownership with democratic governance and profit sharing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Financial Revolution
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Become a member of the world's first Bitcoin-native savings and credit society
          </p>
          
          <Button
            onClick={handleConnect}
            disabled={isPending}
            size="lg"
            className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Wallet className="w-5 h-5 mr-2" />
            {isPending ? 'Connecting...' : 'Join BitSacco Now'}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">BitSacco</h4>
              </div>
              <p className="text-gray-400">
                Revolutionizing cooperative finance with Bitcoin and blockchain technology.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Savings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Member Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">By-Laws</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BitSacco. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
