import { parseEther } from 'viem';

export const BITCOIN_PRICE = {
    USD: 110_000,
    updatedAt: new Date().toISOString()
};

export const SACCO_CONFIG = {
    // Membership fee in USD
    MEMBERSHIP_FEE_USD: 50,
    
    // Calculated values
    MINIMUM_SHARES: BigInt(1),
    SHARE_PRICE_SATS: BigInt(45454), // ~$50 worth of satoshis at $110k/BTC
    
    // Interest rates
    SAVINGS_INTEREST_RATE: BigInt(5),
    LOAN_INTEREST_RATE: BigInt(10),
    
    // Time constants
    SECONDS_PER_YEAR: BigInt(31536000), // 365 * 24 * 60 * 60
    
    // Utility functions
    getSatsFromUSD: (usdAmount: number) => {
        return Math.floor((usdAmount / BITCOIN_PRICE.USD) * 100_000_000);
    },
    
    getUSDFromSats: (satsAmount: number) => {
        return (satsAmount * BITCOIN_PRICE.USD) / 100_000_000;
    }
} as const;

// Export formatted values for smart contracts
export const SACCO_CONTRACT_CONSTANTS = {
    MINIMUM_SHARES: SACCO_CONFIG.MINIMUM_SHARES,
    SHARE_PRICE: SACCO_CONFIG.SHARE_PRICE_SATS,
    SAVINGS_INTEREST_RATE: SACCO_CONFIG.SAVINGS_INTEREST_RATE,
    LOAN_INTEREST_RATE: SACCO_CONFIG.LOAN_INTEREST_RATE,
    SECONDS_PER_YEAR: SACCO_CONFIG.SECONDS_PER_YEAR,
} as const;
