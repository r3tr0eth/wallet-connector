import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NetworkType, NETWORKS } from '../types/networks';
declare global {
    interface Window {
      ethereum?: any;
      solana?: {
        isPhantom?: boolean;
        connect(): Promise<{
          publicKey: {
            toString(): string;
          };
        }>;
        disconnect(): Promise<void>;
      };
    }
  }
  
  interface ConnectionResult {
    account: string;
    chainId: number | string;
    balance: string;
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
    chainId: number | string | null;
    balance: string | null;
    isConnecting: boolean;
    transactions: Transaction[];
    isLoadingTxs: boolean;
    networkType: NetworkType;
  }
export const useWallet = () => {
    const [state, setState] = useState<WalletState>({
        account: null,
        chainId: null,
        balance: null,
        isConnecting: false,
        transactions: [],
        isLoadingTxs: false,
        networkType: NetworkType.ETHEREUM
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

    const connectEthereum = async (): Promise<ConnectionResult> => {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask!');
        }
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(account);
    
        return {
          account,
          chainId: network.chainId,
          balance: ethers.utils.formatEther(balance)
        };
      };
    
      const connectPolygon = async (): Promise<ConnectionResult> => {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask!');
        }
    
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com']
            }]
          });
        } catch (error) {
          console.error('Error switching to Polygon:', error);
        }
    
        return connectEthereum();
      };
    
      const connectSolana = async (): Promise<ConnectionResult> => {
        if (!window.solana || !window.solana.isPhantom) {
          throw new Error('Please install Phantom wallet!');
        }
      
        try {
          const resp = await window.solana.connect();
          const publicKey = resp.publicKey.toString();
          
          // Crear la conexión con opciones
          const connection = new Connection(
            NETWORKS.solana.rpcUrl,
            'confirmed' // confirmación del commitment
          );
      
          try {
            const balance = await connection.getBalance(new PublicKey(publicKey));
            
            return {
              account: publicKey,
              chainId: NETWORKS.solana.id,
              balance: (balance / LAMPORTS_PER_SOL).toString()
            };
          } catch (error) {
            console.error('Error getting Solana balance:', error);
            // Si falla al obtener el balance, devolvemos 0
            return {
              account: publicKey,
              chainId: NETWORKS.solana.id,
              balance: '0'
            };
          }
        } catch (error) {
          console.error('Error connecting to Solana:', error);
          throw error;
        }
      };
      const getTransactions = async (address: string, networkType: NetworkType) => {
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
    
      const connect = async (networkType: NetworkType) => {
        setState(prev => ({ ...prev, isConnecting: true }));
        try {
          let connectionResult: ConnectionResult;
    
          switch (networkType) {
            case NetworkType.ETHEREUM:
              connectionResult = await connectEthereum();
              break;
            case NetworkType.POLYGON:
              connectionResult = await connectPolygon();
              break;
            case NetworkType.SOLANA:
              connectionResult = await connectSolana();
              break;
            default:
              throw new Error('Unsupported network');
          }
    
          setState(prev => ({
            ...prev,
            ...connectionResult,
            networkType,
            isConnecting: false
          }));
    
          await getTransactions(connectionResult.account, networkType);
        } catch (error) {
          setState(prev => ({ ...prev, isConnecting: false }));
          throw error;
        };
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
        supportedNetworks: NETWORKS
      }
};