import { Box, Text } from '@chakra-ui/react';
import LavaTypo from '@/components/Design/LavaTypo';

export default function AdminMerchandise() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <Box>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>
          Merchandising
        </LavaTypo>
        <Text color="gray.600">Merchandise management module coming soon...</Text>
      </Box>
    </Box>
  );
}
