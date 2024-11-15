import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const AnimatedBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      overflow="hidden"
    >
      {/* Gradient Orbs */}
      <MotionBox
        position="absolute"
        top="-10%"
        left="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="linear-gradient(45deg, #7928CA, #FF0080)"
        filter="blur(100px)"
        opacity={0.3}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <MotionBox
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="linear-gradient(45deg, #00DFD8, #007CF0)"
        filter="blur(100px)"
        opacity={0.3}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </Box>
  );
};