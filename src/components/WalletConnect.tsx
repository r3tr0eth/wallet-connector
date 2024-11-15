import { 
    Box, 
    Button, 
    Text, 
    VStack, 
    HStack, 
    useToast, 
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon
   } from '@chakra-ui/react';
   import { ChevronDownIcon } from '@chakra-ui/icons';
   import { motion, AnimatePresence } from 'framer-motion';
   import { useWallet } from '../hooks/useWallet';
   import { TransactionHistory } from './TransactionHistory';
   import { NetworkType, NETWORKS } from '../types/networks';
   
   const MotionVStack = motion(VStack);
   const MotionBox = motion(Box);
   
   export const WalletConnect = () => {
    const { 
      account, 
      connect, 
      disconnect, 
      chainId, 
      balance, 
      isConnecting,
      transactions,
      isLoadingTxs,
      networkType,
      supportedNetworks 
    } = useWallet();
    
    const toast = useToast();
   
    const handleConnect = async (selectedNetwork: NetworkType) => {
      try {
        await connect(selectedNetwork);
        toast({
          title: 'Connected!',
          description: `Successfully connected to ${NETWORKS[selectedNetwork].name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'solid',
          containerStyle: {
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'xl',
          },
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to connect wallet',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
          variant: 'solid',
          containerStyle: {
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.2)',
            borderRadius: 'xl',
          },
        });
      }
    };
   
    const handleDisconnect = () => {
      disconnect();
      toast({
        title: 'Disconnected',
        description: 'Wallet disconnected successfully',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'solid',
        containerStyle: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'xl',
        },
      });
    };
   
    return (
      <MotionVStack
        spacing={6}
        w="100%"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading
          fontSize="4xl"
          bgGradient="linear(to-r, #7928CA, #FF0080)"
          bgClip="text"
          textAlign="center"
        >
          Multi-Chain Wallet
        </Heading>
   
        <Box
          w="100%"
          backdropFilter="blur(10px)"
          bg="whiteAlpha.100"
          borderRadius="2xl"
          p={8}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <AnimatePresence mode="wait">
            {!account ? (
              <MotionBox
                key="connect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VStack spacing={4}>
                  <Text fontSize="lg" textAlign="center" color="whiteAlpha.800">
                    Select a network and connect your wallet
                  </Text>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      w="full"
                      size="lg"
                      variant="outline"
                      mb={4}
                    >
                      Select Network
                    </MenuButton>
                    <MenuList bg="gray.800" borderColor="whiteAlpha.200">
                      {Object.entries(NETWORKS).map(([key, network]) => (
                        <MenuItem
                          key={key}
                          onClick={() => handleConnect(key as NetworkType)}
                          _hover={{ bg: 'whiteAlpha.200' }}
                        >
                          <HStack>
                            <Text>{network.name}</Text>
                            <Text color="gray.400" ml={2}>
                              ({network.symbol})
                            </Text>
                          </HStack>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </VStack>
              </MotionBox>
            ) : (
              <MotionBox
                key="wallet-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between" wrap="wrap" spacing={4}>
                    <Box flex="1" minW="200px">
                      <Text color="whiteAlpha.600" mb={1}>Network</Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {NETWORKS[networkType].name}
                      </Text>
                    </Box>
                    <Box flex="1" minW="200px">
                      <Text color="whiteAlpha.600" mb={1}>Account</Text>
                      <Text fontSize="lg" isTruncated>{account}</Text>
                    </Box>
                  </HStack>
   
                  <Box
                    p={4}
                    bg="whiteAlpha.100"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                  >
                    <Text color="whiteAlpha.600">Balance</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {balance ? `${parseFloat(balance).toFixed(4)} ${NETWORKS[networkType].symbol}` : 'Loading...'}
                    </Text>
                  </Box>
   
                  <HStack spacing={4}>
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnect}
                      size="lg"
                      flex="1"
                    >
                      Disconnect
                    </Button>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        size="lg"
                        flex="1"
                      >
                        Switch Network
                      </MenuButton>
                      <MenuList bg="gray.800" borderColor="whiteAlpha.200">
                        {Object.entries(NETWORKS).map(([key, network]) => (
                          <MenuItem
                            key={key}
                            onClick={() => handleConnect(key as NetworkType)}
                            _hover={{ bg: 'whiteAlpha.200' }}
                          >
                            <HStack>
                              <Text>{network.name}</Text>
                              <Text color="gray.400" ml={2}>
                                ({network.symbol})
                              </Text>
                            </HStack>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </HStack>
   
                  <Box mt={8}>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      mb={4}
                      bgGradient="linear(to-r, #7928CA, #FF0080)"
                      bgClip="text"
                    >
                      Transaction History
                    </Text>
                    <TransactionHistory 
                      transactions={transactions} 
                      isLoading={isLoadingTxs}
                    />
                  </Box>
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
      </MotionVStack>
    );
   };