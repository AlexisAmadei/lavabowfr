import { Box } from '@chakra-ui/react';
import AdminSpotlight from './AdminSpotlight';
import AdminEvents from './AdminEvents';
import AdminPictures from './AdminPictures';
import AdminClicks from './AdminClicks';

export default function AdminContent() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <AdminSpotlight />
      <AdminEvents />
      <AdminPictures />
      <AdminClicks />
    </Box>
  )
}