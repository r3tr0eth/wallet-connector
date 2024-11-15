import { ChakraProvider, Container, VStack, Heading } from '@chakra-ui/react'
import { WalletConnect } from './components/WalletConnect'

export default function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack spacing={6}>
          <Heading>Web3 Wallet Connector</Heading>
          <WalletConnect />
        </VStack>
      </Container>
    </ChakraProvider>
  )
}