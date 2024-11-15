# Web3 Wallet Connector

Una aplicación React que permite conectar carteras Web3 (MetaMask) y mostrar información básica como balance, dirección y red.

## Tecnologías

- React + TypeScript
- Ethers.js
- Chakra UI
- MetaMask

## Características

- Conexión/desconexión de wallet
- Visualización de balance de ETH
- Detección de cambios de red
- Detección de cambios de cuenta
- Soporte para múltiples redes (Mainnet, Goerli, Sepolia)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el proyecto
npm start
```

## Uso

1. Asegúrate de tener MetaMask instalado
2. Conecta tu wallet usando el botón "Conectar Wallet"
3. Visualiza tu información de cuenta

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes React
  ├── hooks/         # Custom hooks (useWallet)
  ├── theme/         # Configuración de Chakra UI
  ├── types/         # TypeScript types
  └── utils/         # Utilidades
```