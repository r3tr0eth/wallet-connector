export enum NetworkType {
    ETHEREUM = 'ethereum',
    POLYGON = 'polygon',
    SOLANA = 'solana'
  }
  
  export interface NetworkConfig {
    id: string | number;
    name: string;
    symbol: string;
    icon?: string;
    rpcUrl: string;
    explorerUrl: string;
  }
  
  export const NETWORKS: Record<NetworkType, NetworkConfig> = {
    [NetworkType.ETHEREUM]: {
      id: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/your-infura-id',
      explorerUrl: 'https://etherscan.io'
    },
    [NetworkType.POLYGON]: {
      id: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com'
    },
    [NetworkType.SOLANA]: {
        id: '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
        name: 'Solana',
        symbol: 'SOL',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        // O alternativamente:
        // rpcUrl: 'https://solana-api.projectserum.com',
        // rpcUrl: 'https://rpc.ankr.com/solana',
        explorerUrl: 'https://explorer.solana.com'
      }
  };