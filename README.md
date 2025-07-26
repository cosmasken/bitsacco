# Jenga - Bitcoin Sacco dApp

A modern React-based decentralized application for creating and managing Bitcoin savings cooperatives (Saccos) on the Citrea testnet, built with wagmi, viem, and Web3Auth.

## 🚀 Features

- **Modern Web3 Stack**: Built with wagmi v2 and viem for type-safe Ethereum interactions
- **Social Login**: Web3Auth integration for seamless user onboarding with Google, Facebook, etc.
- **Smart Contract Integration**: Direct interaction with Sacco smart contracts
- **Real-time Data**: Live balance and contract state updates
- **Type Safety**: Full TypeScript support with contract ABI types
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: wagmi v2, viem, Web3Auth
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI primitives
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm
- Web3Auth Client ID (for social login)
- Access to Citrea testnet

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cosmasken/bitsacco
   cd bitsacco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   ```

## 🔑 Getting Web3Auth Client ID

1. Visit [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Create a new project
3. Configure your domain settings:
   - **Development**: `http://localhost:5173`
   - **Production**: Your deployed domain
4. Copy the Client ID to your `.env` file

## 🌐 Network Configuration

The app is configured for **Citrea Testnet**:
- **Chain ID**: 5115
- **RPC URL**: https://rpc.testnet.citrea.xyz
- **Explorer**: https://explorer.testnet.citrea.xyz
- **Currency**: cBTC (Citrea Bitcoin)

### Getting Testnet Funds

Visit the [Citrea Faucet](https://faucet.testnet.citrea.xyz) to get testnet cBTC for testing.

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Usage

### Connecting Your Wallet

1. **Web3Auth (Recommended)**: Click "Connect with Social" to sign in with Google, Facebook, or other social providers
2. **Injected Wallet**: Connect with MetaMask or other browser wallets
3. **WalletConnect**: Connect with mobile wallets

### Joining a Sacco

1. Connect your wallet
2. Register as a member in an existing Sacco
3. Purchase shares to participate in the cooperative
4. Start making savings deposits and participating in governance

### Sacco Operations

- **Member Registration**: Register as a new member in the Sacco
- **Share Purchase**: Buy shares to increase voting power and participation
- **Savings Deposits**: Make regular savings contributions
- **Loan Requests**: Request loans backed by your savings and guarantees
- **Board Management**: Participate in board elections and governance
- **Proposal Voting**: Vote on Sacco proposals and decisions

### Contract Interactions

The app uses wagmi hooks for all contract interactions:

```typescript
// Reading contract data
const { useGetMemberInfo } = useSacco();
const { data: memberInfo } = useGetMemberInfo(address);
const { data: savings } = useSavings(address);

// Writing to contract
const { registerMember, isPending, isConfirmed } = useRegisterMember();
const { depositSavings } = useDepositSavings();
const { requestLoan } = useRequestLoan();
```

## 🏗 Architecture

### Wagmi Configuration (`src/wagmi.ts`)

```typescript
export const wagmiConfig = createConfig({
  chains: [citreaTestnet, mainnet, sepolia],
  connectors: [
    web3AuthConnector({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: 'sapphire_devnet',
    }),
    injected(),
    walletConnect({ projectId: '...' }),
  ],
  // ... other config
});
```

### Custom Web3Auth Connector

Located in `src/lib/web3auth-connector.ts`, this provides seamless integration between Web3Auth and wagmi.

### Contract Hooks (`src/hooks/useSacco.ts`)

Type-safe hooks for contract interactions:
- `useGetMemberInfo(address)` - Get member details and registration status
- `useSavings(address)` - Get member's savings balance
- `useRegisterMember()` - Register as a new member in the Sacco
- `useDepositSavings()` - Make savings deposits
- `useRequestLoan()` - Request loans from the Sacco
- `useVotingPower(address)` - Get member's voting power
- `useProposal(proposalId)` - Get proposal details
- `useBoardMembers()` - Get current board members

### Smart Contract Configuration

```typescript
export const SACCO_CONTRACT = {
  address: '0xEBb3724F27f7a69fE123386c52323aCE2B397259',
  abi: SaccoABI,
} as const;
```

## 🔒 Security Features

- **Type Safety**: Full TypeScript coverage with contract ABI types
- **Transaction Validation**: Pre-flight checks before contract calls
- **Error Handling**: Comprehensive error states and user feedback
- **Secure Storage**: Wagmi's secure storage for wallet connections

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 🏗 Building

Build for production:
```bash
npm run build
```

Build for development:
```bash
npm run build:dev
```

## 📦 Deployment

The app can be deployed to any static hosting service:

1. **Vercel** (Recommended)
   ```bash
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm run build
   # Upload dist/ folder
   ```

3. **GitHub Pages**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `VITE_WEB3AUTH_CLIENT_ID`
- `VITE_WALLETCONNECT_PROJECT_ID`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Web3Auth Connection Issues**
   - Verify your Client ID is correct
   - Check domain configuration in Web3Auth dashboard
   - Ensure you're using the correct network (sapphire_devnet for testnet)

2. **Contract Call Failures**
   - Ensure you have sufficient cBTC for gas fees
   - Verify contract address is correct
   - Check if you're connected to Citrea testnet

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version (18+ required)

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Join our [Discord](https://discord.gg/your-discord) community
- Read the [wagmi documentation](https://wagmi.sh)

## 🔗 Links

- [Citrea Testnet](https://citrea.xyz)
- [Web3Auth](https://web3auth.io)
- [wagmi](https://wagmi.sh)
- [viem](https://viem.sh)
- [Radix UI](https://radix-ui.com)
