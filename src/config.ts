interface ChainConfig {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  currency: string;
  explorer: string;
}

interface SmartContracts {
  sacco: string;
}

export const citreaTestnet = {
  id: 5115,
  name: 'Citrea Testnet',
  network: 'citrea-testnet',
  nativeCurrency: {
    decimals: 8,
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.citrea.xyz'] },
    default: { http: ['https://rpc.testnet.citrea.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.citrea.xyz' },
  },
  smartContracts: {
    sacco: '0x0000000000000000000000000000000000000000', // Existing SACCO contract
  },
} as const;

export const TESTNET_CONFIG: {
  chain: ChainConfig;
  smartContracts: SmartContracts;
} = {
  chain: {
    chainId: citreaTestnet.id,
    chainName: citreaTestnet.name,
    rpcUrl: citreaTestnet.rpcUrls.default.http[0],
    currency: citreaTestnet.nativeCurrency.symbol,
    explorer: citreaTestnet.blockExplorers.default.url,
  },
  smartContracts: {
    sacco: '0x0000000000000000000000000000000000000000',
  },
};


