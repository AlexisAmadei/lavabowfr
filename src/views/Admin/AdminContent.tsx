import { Box } from '@chakra-ui/react';
import AdminSpotlight from './Content/AdminSpotlight';
import AdminEvents from './Content/AdminEvents';
import AdminPictures from './Content/AdminPictures';
import AdminClicks from './Content/AdminClicks';
import AdminVideos from './Content/AdminVideos';

export default function AdminContent() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <AdminSpotlight />
      <AdminEvents />
      <AdminPictures />
      <AdminClicks />
      <AdminVideos />
    </Box>
  )
}