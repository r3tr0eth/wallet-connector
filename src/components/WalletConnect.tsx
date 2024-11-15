import { Box, Button, Text, VStack, HStack, useToast, Heading } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { TransactionHistory } from './TransactionHistory';

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
        isLoadingTxs
    } = useWallet();
    const toast = useToast();

    const handleConnect = async () => {
        try {
            await connect();
            toast({
                title: 'Connected!',
                description: 'Wallet connected successfully',
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
    const getNetworkName = (id: number | null) => {
        switch (id) {
            case 1: return 'Ethereum Mainnet';
            case 5: return 'Goerli Testnet';
            case 11155111: return 'Sepolia Testnet';
            default: return `Chain ID: ${id}`;
        }
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
                Web3 Wallet
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
                                    Connect your wallet to get started
                                </Text>
                                <Button
                                    size="lg"
                                    onClick={handleConnect}
                                    isLoading={isConnecting}
                                    loadingText="Connecting..."
                                    w="full"
                                    h="60px"
                                    fontSize="lg"
                                >
                                    Connect Wallet
                                </Button>
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
                                        <Text color="whiteAlpha.600" mb={1}>Account</Text>
                                        <Text fontSize="lg" fontWeight="bold">{account}</Text>
                                    </Box>
                                    <Box>
                                        <Text color="whiteAlpha.600" mb={1}>Network</Text>
                                        <Text fontSize="lg">{getNetworkName(chainId)}</Text>
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
                                        {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                                    </Text>
                                </Box>

                                <Button
                                    variant="outline"
                                    onClick={handleDisconnect}
                                    size="lg"
                                >
                                    Disconnect
                                </Button>

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
                                        chainId={chainId}
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