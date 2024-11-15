# Multi-Chain Wallet Connector

A comprehensive React application for interacting with multiple blockchain networks. The application provides a seamless interface for connecting wallets, viewing balances, and tracking transaction history across Ethereum, Polygon, and Solana networks.

## Core Features

### Wallet Management
- Multi-wallet support
  - MetaMask (ETH, MATIC)
  - Phantom (SOL)
- Secure wallet connection/disconnection
- Real-time balance updates
- Account address display with copy functionality

### Network Support
- **Ethereum Mainnet**
  - Native ETH balance
  - Transaction history
  - Gas price monitoring
- **Polygon Network**
  - MATIC balance tracking
  - Network switching support
  - Transaction history
- **Solana**
  - SOL balance display
  - Transaction tracking
  - Program interaction support

### Transaction Management
- Cross-chain transaction history
- Network-specific transaction details
- Transaction status tracking
- Explorer links for each network
- Filtering and sorting capabilities

### User Interface
- Modern glassmorphic design
- Responsive layout for all devices
- Interactive animations and transitions
- Toast notifications for all actions
- Network-specific badges and indicators

## Technical Stack

### Core Technologies
- React 18.x
- TypeScript 4.x
- Node.js 16+

### Blockchain Integration
- ethers.js v5.7.2 (Ethereum/Polygon)
- @solana/web3.js (Solana)
- web3 (Additional EVM support)

### UI/UX
- Chakra UI
- Framer Motion
- @chakra-ui/icons
- Custom animations

### State Management
- React Hooks
- Custom wallet hook
- Context API

## Installation

### Prerequisites
```bash
Node.js >= 16.0.0
npm >= 8.0.0
MetaMask wallet extension
Phantom wallet extension
```

### Setup Steps
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd multi-chain-wallet-connector

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.tsx     # Main wallet connection component
│   ├── TransactionHistory.tsx # Transaction display component
│   └── AnimatedBackground.tsx # UI background effects
├── hooks/
│   └── useWallet.ts          # Custom wallet interaction hook
├── theme/
│   └── index.ts              # Chakra UI theme configuration
├── types/
│   ├── networks.ts           # Network type definitions
│   └── index.ts              # Common type definitions
└── utils/
    └── constants.ts          # Configuration constants
```

## Usage Guide

### Initial Setup
1. Install required wallet extensions:
   - MetaMask for ETH/MATIC networks
   - Phantom for SOL network

### Connecting Wallets
1. Select desired network from dropdown
2. Click "Connect Wallet" button
3. Approve connection in wallet extension
4. View connected wallet information

### Viewing Transactions
1. Connect wallet to desired network
2. Navigate to transaction history section
3. View network-specific transactions
4. Click "View" to open transaction in explorer

### Network Switching
1. Click "Switch Network" button
2. Select desired network from dropdown
3. Approve network switch in wallet
4. View updated wallet information

## Network Configurations

### Ethereum
- Network ID: 1
- RPC URL: Infura/Custom
- Explorer: Etherscan

### Polygon
- Network ID: 137
- RPC URL: Polygon RPC
- Explorer: Polygonscan

### Solana
- Cluster: Mainnet Beta
- RPC URL: Solana RPC
- Explorer: Solana Explorer

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Future Enhancements

- [ ] Add support for additional networks (BSC, Avalanche)
- [ ] Implement token balance tracking
- [ ] Add transaction filtering and search
- [ ] Integrate DeFi protocol interactions
- [ ] Add wallet connection persistence