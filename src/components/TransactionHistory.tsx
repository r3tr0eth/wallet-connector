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
    useColorModeValue,
    Badge
  } from '@chakra-ui/react';
  import { ExternalLinkIcon } from '@chakra-ui/icons';
  import { motion } from 'framer-motion';
  
  const MotionBox = motion(Box);
  
  interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
  }
  
  interface TransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
    chainId?: number | null;
  }
  
  export const TransactionHistory = ({ transactions, isLoading, chainId }: TransactionHistoryProps) => {
    const getExplorerUrl = (hash: string) => {
      const baseUrl = chainId === 1 ? 'https://etherscan.io' :
                     chainId === 5 ? 'https://goerli.etherscan.io' :
                     chainId === 11155111 ? 'https://sepolia.etherscan.io' :
                     'https://etherscan.io';
      return `${baseUrl}/tx/${hash}`;
    };
  
    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
                  <Text color="whiteAlpha.900" fontSize="sm">
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </Text>
                </Td>
                <Td>
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
                </Td>
                <Td>
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
                </Td>
                <Td isNumeric>
                  <Text
                    bgGradient="linear(to-r, purple.400, pink.400)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    {parseFloat(tx.value).toFixed(4)} ETH
                  </Text>
                </Td>
                <Td>
                  <Link 
                    href={getExplorerUrl(tx.hash)} 
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