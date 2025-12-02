import LavaTypo from '@/components/Design/LavaTypo';
import { Box } from '@chakra-ui/react'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import './OnlineCounter.css'

export default function OnlineCounter() {
  const [online, setOnline] = useState(1234);

  return (
    <Box display={'inline-flex'} alignItems={'center'} gap={2}>
      <LavaTypo variant='p' className='online-counter'>{online}</LavaTypo>
      <FontAwesomeIcon icon={faUserGroup} size='lg' />
    </Box>
  )
}
