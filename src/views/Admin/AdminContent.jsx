import { Box } from '@chakra-ui/react';
import AdminSpotlight from './AdminSpotlight';
import AdminEvents from './AdminEvents';

export default function AdminContent() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8}>
      <AdminSpotlight />
      <AdminEvents />
    </Box>
  )
}