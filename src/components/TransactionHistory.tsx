import { 
    Box, 
    VStack, 
    Text, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    Spinner, 
    Link,
    Badge,
    Tooltip,
    Icon
  } from '@chakra-ui/react';
  import { ExternalLinkIcon } from '@chakra-ui/icons';
  import { motion } from 'framer-motion';
  import { NetworkType, NETWORKS } from '../types/networks';
  
  const MotionBox = motion(Box);
  
  interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    network: NetworkType;
  }
  
  interface TransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
  }
  
  export const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
    const getExplorerUrl = (hash: string, network: NetworkType) => {
      const baseUrl = NETWORKS[network].explorerUrl;
      switch (network) {
        case NetworkType.ETHEREUM:
        case NetworkType.POLYGON:
          return `${baseUrl}/tx/${hash}`;
        case NetworkType.SOLANA:
          return `${baseUrl}/tx/${hash}`;
        default:
          return '';
      }
    };
  
    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
  
    const getNetworkBadgeProps = (network: NetworkType) => {
      switch (network) {
        case NetworkType.ETHEREUM:
          return {
            bg: 'blue.500',
            color: 'white',
          };
        case NetworkType.POLYGON:
          return {
            bg: 'purple.500',
            color: 'white',
          };
        case NetworkType.SOLANA:
          return {
            bg: 'green.500',
            color: 'white',
          };
        default:
          return {
            bg: 'gray.500',
            color: 'white',
          };
      }
    };
  
    const formatValue = (value: string, network: NetworkType) => {
      const symbol = NETWORKS[network].symbol;
      return `${parseFloat(value).toFixed(4)} ${symbol}`;
    };
  
    if (isLoading) {
      return (
        <Box 
          textAlign="center" 
          py={8}
          bg="whiteAlpha.100"
          borderRadius="xl"
          backdropFilter="blur(10px)"
        >
          <Spinner 
            size="xl" 
            thickness="4px"
            speed="0.65s"
            emptyColor="whiteAlpha.200"
            color="purple.500"
          />
        </Box>
      );
    }
  
    if (transactions.length === 0) {
      return (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          textAlign="center" 
          py={8}
          bg="whiteAlpha.100"
          borderRadius="xl"
          backdropFilter="blur(10px)"
        >
          <Text color="whiteAlpha.700">No transactions found</Text>
        </MotionBox>
      );
    }
  
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        overflowX="auto" 
        w="100%"
        bg="whiteAlpha.100"
        borderRadius="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Table variant="unstyled" size="md">
          <Thead>
            <Tr>
              <Th color="whiteAlpha.600">Network</Th>
              <Th color="whiteAlpha.600">Time</Th>
              <Th color="whiteAlpha.600">From</Th>
              <Th color="whiteAlpha.600">To</Th>
              <Th color="whiteAlpha.600" isNumeric>Value</Th>
              <Th color="whiteAlpha.600">Hash</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((tx) => (
              <Tr
                key={tx.hash}
                _hover={{
                  bg: 'whiteAlpha.100',
                  transition: 'all 0.2s',
                }}
              >
                <Td>
                  <Badge
                    {...getNetworkBadgeProps(tx.network)}
                    borderRadius="md"
                    px={2}
                    py={1}
                  >
                    {NETWORKS[tx.network].name}
                  </Badge>
                </Td>
                <Td>
                  <Tooltip 
                    label={new Date(tx.timestamp * 1000).toLocaleString()} 
                    placement="top"
                  >
                    <Text color="whiteAlpha.900" fontSize="sm">
                      {new Date(tx.timestamp * 1000).toLocaleString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label={tx.from} placement="top">
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="whiteAlpha.200"
                      color="white"
                      fontFamily="mono"
                      fontSize="sm"
                    >
                      {formatAddress(tx.from)}
                    </Badge>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label={tx.to} placement="top">
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="whiteAlpha.200"
                      color="white"
                      fontFamily="mono"
                      fontSize="sm"
                    >
                      {formatAddress(tx.to)}
                    </Badge>
                  </Tooltip>
                </Td>
                <Td isNumeric>
                  <Text
                    bgGradient="linear(to-r, purple.400, pink.400)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    {formatValue(tx.value, tx.network)}
                  </Text>
                </Td>
                <Td>
                  <Link 
                    href={getExplorerUrl(tx.hash, tx.network)} 
                    isExternal
                    display="flex"
                    alignItems="center"
                    fontSize="sm"
                    color="purple.400"
                    _hover={{
                      color: 'pink.400',
                      textDecoration: 'none',
                    }}
                  >
                    View 
                    <ExternalLinkIcon ml={2} />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </MotionBox>
    );
  };