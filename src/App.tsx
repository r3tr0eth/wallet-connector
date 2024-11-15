import { ChakraProvider, Container } from '@chakra-ui/react';
import { theme } from './theme';
import { WalletConnect } from './components/WalletConnect';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AnimatedBackground />
      <Container 
        maxW="container.md" 
        py={10}
        display="flex"
        minH="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <WalletConnect />
      </Container>
    </ChakraProvider>
  );
}

export default App;