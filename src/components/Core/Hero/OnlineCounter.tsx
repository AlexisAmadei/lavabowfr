import LavaTypo from '@/components/Design/LavaTypo';
import { Box } from '@chakra-ui/react'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import './OnlineCounter.css'

export default function OnlineCounter() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  // useEffect(() => {
  //   const eventSource = new EventSource('/api/online-polling');

  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setOnlineUsers(data.onlineUsers);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  return (
    // <Box display={'inline-flex'} alignItems={'center'} gap={2}>
    //   <LavaTypo variant='p' className='online-counter'>{onlineUsers}</LavaTypo>
    //   <FontAwesomeIcon icon={faUserGroup} size='lg' />
    // </Box>
    <></>
  )
}
