import LavaTypo from '@/components/Design/LavaTypo';
import { Box } from '@chakra-ui/react'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import './OnlineCounter.css'
import { supabase } from '@/utils/supabase/supabase';

export default function OnlineCounter() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase
      .channel('online_users_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'online_users' },
        async () => {
          const { count } = await supabase
            .from('online_users')
            .select('*', { count: 'exact', head: true });
          setOnlineUsers(count || 0);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <Box display={'inline-flex'} alignItems={'center'} gap={2}>
      <LavaTypo variant='p' className='online-counter'>{onlineUsers}</LavaTypo>
      <FontAwesomeIcon icon={faUserGroup} size='lg' />
    </Box>
  )
}
