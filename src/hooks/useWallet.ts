import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    balance: null,
    isConnecting: false,
  });

  const updateBalance = useCallback(async (address: string) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      setState(prev => ({
        ...prev,
        balance: ethers.utils.formatEther(balance)
      }));
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      setState({
        account,
        chainId: network.chainId,
        balance: ethers.utils.formatEther(balance),
        isConnecting: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  };

  const disconnect = () => {
    setState({
      account: null,
      chainId: null,
      balance: null,
      isConnecting: false,
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        const newAccount = accounts[0];
        setState(prev => ({ ...prev, account: newAccount || null }));
        if (newAccount) {
          updateBalance(newAccount);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setState(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16)
        }));
      });

      return () => {
        window.ethereum.removeAllListeners();
      };
    }
  }, [updateBalance]);

  return {
    ...state,
    connect,
    disconnect,
  };
};