import { Box, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

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
      <Box textAlign="center" py={4}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">No transactions found</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto" w="100%">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Time</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th isNumeric>Value (ETH)</Th>
            <Th>Tx Hash</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <Tr key={tx.hash}>
              <Td whiteSpace="nowrap">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </Td>
              <Td>
                <Text isTruncated maxW="150px" title={tx.from}>
                  {formatAddress(tx.from)}
                </Text>
              </Td>
              <Td>
                <Text isTruncated maxW="150px" title={tx.to}>
                  {formatAddress(tx.to)}
                </Text>
              </Td>
              <Td isNumeric>
                {parseFloat(tx.value).toFixed(4)}
              </Td>
              <Td>
                <Link 
                  href={getExplorerUrl(tx.hash)} 
                  isExternal 
                  color="blue.500"
                  fontSize="sm"
                >
                  View <ExternalLinkIcon mx="2px" />
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};