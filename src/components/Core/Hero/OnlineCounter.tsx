import LavaTypo from '@/components/Design/LavaTypo';
import { Box } from '@chakra-ui/react'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import './OnlineCounter.css'
import { supabase } from '@/utils/supabase/supabase';
import { Tooltip } from '@/components/ui/tooltip';

export default function OnlineCounter() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [mouseEnter, setMouseEnter] = useState(false);

  useEffect(() => {
    // Fetch initial count
    const fetchInitialCount = async () => {
      const { count } = await supabase
        .from('online_users')
        .select('*', { count: 'exact', head: true });
      setOnlineUsers(count || 0);
    };

    fetchInitialCount();

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
    <Tooltip content={`${onlineUsers} user${onlineUsers !== 1 ? 's' : ''} online`} openDelay={100}>
      <Box
        display={'inline-flex'}
        alignItems={'center'}
        gap={2}
        padding={'6px 10px'}
        borderRadius={50}
        transition={'all 0.1s ease-in-out'}
        // backgroundColor={onlineUsers < 0 ? 'blackAlpha.900' : 'green.solid'}

        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
      >
        <LavaTypo variant='p' className='online-counter' style={{ pointerEvents: 'none', userSelect: 'none' }}>{onlineUsers}</LavaTypo>
        <Box className={`${onlineUsers ? 'online-counter_blink' : ''}`}>
          <FontAwesomeIcon icon={faGlobe} size='lg'
            color={
              mouseEnter
                ? 'white'
                : onlineUsers > 0
                  ? 'MediumSeaGreen' : 'white'
            }
          />
        </Box>
      </Box>
    </Tooltip>
  )
}
