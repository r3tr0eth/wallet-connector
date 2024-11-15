import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}
// Interfaces
interface BlockTransaction {
    hash: string;
    from: string;
    to: string | null;
    value: ethers.BigNumber;
  }
  
  interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
  }
  
  interface WalletState {
    account: string | null;
    chainId: number | null;
    balance: string | null;
    isConnecting: boolean;
    transactions: Transaction[];
    isLoadingTxs: boolean;
  }
export const useWallet = () => {
    const [state, setState] = useState<WalletState>({
        account: null,
        chainId: null,
        balance: null,
        isConnecting: false,
        transactions: [],
        isLoadingTxs: false
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

    // Modificamos la función connect para que también obtenga las transacciones
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

            setState(prev => ({
                ...prev,
                account,
                chainId: network.chainId,
                balance: ethers.utils.formatEther(balance),
                isConnecting: false,
            }));

            // Obtenemos las transacciones después de conectar
            await getTransactions(account);
        } catch (error) {
            setState(prev => ({ ...prev, isConnecting: false }));
            throw error;
        }
    };

    const getTransactions = async (address: string) => {
        setState(prev => ({ ...prev, isLoadingTxs: true }));
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const currentBlock = await provider.getBlockNumber();
          const transactions: Transaction[] = [];
    
          for (let i = 0; i < 10; i++) {
            // Añadimos true como segundo parámetro para obtener las transacciones completas
            const block = await provider.getBlock(currentBlock - i);
            if (block?.transactions) {
              // Aseguramos que tenemos las transacciones completas
              const blockTxs = block.transactions
                .filter((tx: any) => {
                  const fromMatch = tx.from?.toLowerCase() === address.toLowerCase();
                  const toMatch = tx.to?.toLowerCase() === address.toLowerCase();
                  return fromMatch || toMatch;
                })
                .map((tx: any) => ({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to || '',
                  value: ethers.utils.formatEther(tx.value),
                  timestamp: block.timestamp
                }));
    
              transactions.push(...blockTxs);
            }
          }
    
          setState(prev => ({
            ...prev,
            transactions,
            isLoadingTxs: false
          }));
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setState(prev => ({ ...prev, isLoadingTxs: false }));
        }
    };
    const disconnect = () => {
        setState(prev => ({
            ...prev,
            account: null,
            chainId: null,
            balance: null,
            isConnecting: false,
            transactions: [],
            isLoadingTxs: false
        }));
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