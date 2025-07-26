import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Share } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { usePurchaseShares, useSacco } from '../../hooks/useSacco';
import { formatEther, parseEther } from 'viem';

interface PurchaseSharesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHARE_PRICE = "0.00001"; // 0.001 cBTC per share
const MINIMUM_SHARES = 1;

export const PurchaseSharesModal: React.FC<PurchaseSharesModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [shares, setShares] = useState<string>(MINIMUM_SHARES.toString());
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isConnected, address } = useAccount();

  const { purchaseShares, hash, error, isPending, isConfirming, isConfirmed } = usePurchaseShares();
  const { useGetMemberInfo } = useSacco();
  const { data: memberInfo } = useGetMemberInfo(address!);

  const isMember = memberInfo && memberInfo[0] > 0; // memberInfo[0] is shares
  const currentShares = memberInfo ? Number(memberInfo[0]) : 0;

  const totalCost = (parseFloat(shares) * parseFloat(SHARE_PRICE)).toFixed(5);

  useEffect(() => {
    if (!open) {
      setShares(MINIMUM_SHARES.toString());
    }
  }, [open]);

  useEffect(() => {
    if (isConfirmed && hash) {
      const successTitle = isMember ? 'Shares Purchased!' : 'Welcome to the Sacco!';
      const successDescription = isMember 
        ? `You now own ${currentShares + parseInt(shares)} shares total.`
        : 'You are now a member! You can deposit savings and request loans.';
      
      toast({
        title: successTitle,
        description: (
          <div className="space-y-2">
            <p>{successDescription}</p>
            <a
              href={`https://explorer.testnet.citrea.xyz/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              View transaction on Citrea Scan
            </a>
          </div>
        ),
      });
      onOpenChange(false);
    }
  }, [isConfirmed, hash, shares, totalCost, toast, onOpenChange, isMember, currentShares]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const shareCount = parseInt(shares);
    if (!shareCount || shareCount < MINIMUM_SHARES) {
      toast({
        title: 'Error',
        description: `Please enter at least ${MINIMUM_SHARES} shares.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      purchaseShares(shareCount, totalCost);
    } catch (err: unknown) {
      toast({
        title: 'Purchase Failed',
        description: (err as Error).message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="w-5 h-5 text-blue-500" />
            {isMember ? 'Purchase Additional Shares' : 'Become a Sacco Member'}
          </DialogTitle>
          <DialogDescription>
            {isMember 
              ? 'Purchase more shares to increase your voting power and guarantee capacity.'
              : 'Purchase shares to become a member of the Sacco. Members can deposit savings, request loans, and participate in governance.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shares">{t('sacco.purchaseShares.sharesLabel')}</Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              min={MINIMUM_SHARES}
              placeholder={MINIMUM_SHARES.toString()}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              disabled={isPending || isConfirming}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('sacco.purchaseShares.sharePrice', { price: SHARE_PRICE })}
            </p>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Cost:
              </span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {totalCost} cBTC
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {shares} shares × {SHARE_PRICE} cBTC
            </p>
            {isMember && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                You currently own {currentShares} shares
              </p>
            )}
          </div>

          {/* Member Benefits for New Users */}
          {!isMember && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Member Benefits:
              </h4>
              <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <li>• Deposit savings and earn interest</li>
                <li>• Request loans backed by your savings</li>
                <li>• Vote on Sacco proposals and governance</li>
                <li>• Provide guarantees for other members</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error.message.includes('execution reverted') 
                  ? 'Transaction failed. Check if you have sufficient balance or are already a member.'
                  : error.message.split('\n')[0]
                }
              </p>
            </div>
          )}

          {!isConnected && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please connect your wallet to purchase shares.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isPending || isConfirming}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isPending || isConfirming || !isConnected || !shares || parseInt(shares) < MINIMUM_SHARES}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isConfirming ? t('common.confirming') : t('common.processing')}
                </>
              ) : (
                <>
                  <Share className="w-4 h-4 mr-2" />
                  {t('sacco.purchaseShares.purchaseButton')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
