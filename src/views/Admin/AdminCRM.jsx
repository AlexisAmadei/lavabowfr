import { Box, Text } from '@chakra-ui/react';
import LavaTypo from '@/components/Design/LavaTypo';

export default function AdminCRM() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <Box>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>
          CRM
        </LavaTypo>
        <Text color="gray.600">Customer Relationship Management module coming soon...</Text>
      </Box>
    </Box>
  );
}
