import { Box, Button, Text, VStack, useToast } from '@chakra-ui/react'
import { useWallet } from '../hooks/useWallet'

export const WalletConnect = () => {
 const { account, connect, disconnect, chainId, balance, isConnecting } = useWallet()
 const toast = useToast()

 const handleConnect = async () => {
   try {
     await connect()
   } catch (error) {
     toast({
       title: 'Error',
       description: error instanceof Error ? error.message : 'Failed to connect wallet',
       status: 'error',
       duration: 5000,
     })
   }
 }

 const getNetworkName = (id: number | null) => {
   switch (id) {
     case 1: return 'Ethereum Mainnet'
     case 5: return 'Goerli Testnet' 
     case 11155111: return 'Sepolia Testnet'
     default: return `Chain ID: ${id}`
   }
 }

 return (
   <VStack spacing={4} p={6} borderRadius="lg" borderWidth="1px" bg="white" shadow="md">
     {!account ? (
       <Button
         colorScheme="blue"
         onClick={handleConnect}
         isLoading={isConnecting}
         loadingText="Conectando..."
         size="lg"
         width="full"
       >
         Conectar Wallet
       </Button>
     ) : (
       <VStack spacing={3} align="stretch" w="100%">
         <Box>
           <Text fontSize="sm" color="gray.500">Cuenta</Text>
           <Text isTruncated maxW="300px" fontWeight="bold">{account}</Text>
         </Box>
         <Box>
           <Text fontSize="sm" color="gray.500">Red</Text>
           <Text fontWeight="medium">{getNetworkName(chainId)}</Text>
         </Box>
         <Box>
           <Text fontSize="sm" color="gray.500">Balance</Text>
           <Text fontWeight="medium">
             {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Cargando...'}
           </Text>
         </Box>
         <Button colorScheme="red" onClick={disconnect} mt={2}>
           Desconectar
         </Button>
       </VStack>
     )}
   </VStack>
 )
}