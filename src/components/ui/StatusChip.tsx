import { Box } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'

export default function StatusChip({ status }: { status: string }) {
  if (!status) return null;
  return (
    <Box className='status-chip'
      position={'absolute'}
      top={'-10px'}
      right={12}
      backgroundColor={status.toLowerCase() === 'active' ? 'green.100' : status.toLowerCase() === 'inactive' ? 'red.100' : ''}
      paddingX={2}
      borderRadius={'full'}
    >
      <LavaTypo size={'14px'}>{status.toLowerCase() === 'active' ? 'actif' : status.toLowerCase() === 'inactive' ? 'inactif' : ''}</LavaTypo>
    </Box>
  )
}
