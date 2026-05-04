import LavaTypo from '@/components/Design/LavaTypo'
import { Toaster } from '@/components/ui/toaster';
import { Box } from '@chakra-ui/react'
import MailChimp from './MailChimp';

export default function AdminUsers() {
  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <LavaTypo variant='h3' color='black'>CRM - Newsletter</LavaTypo>
      <MailChimp />
      <Toaster />
    </Box>
  )
}
