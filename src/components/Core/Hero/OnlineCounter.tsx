import LavaTypo from '@/components/Design/LavaTypo';
import { Box } from '@chakra-ui/react'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import './OnlineCounter.css'
import { supabase } from '@/utils/supabase/supabase';

export default function OnlineCounter() {
  const [online, setOnline] = useState(0);

  useEffect(() => {
    async function fetchOnlineCount() {
      let { data: realtime_values, error } = await supabase
        .from('realtime_values')
        .select('value')
        .eq('identifier_id', 2)
        .single();

      if (error) {
        console.error('Error fetching online count:', error);
        return;
      }
      setOnline(realtime_values?.value || 0);
    }
    fetchOnlineCount()
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('public:realtime_values_online')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'realtime_values', filter: 'identifier_id=eq.2' },
        (payload) => {
          console.log('Received realtime update for online count:', payload);
          setOnline(payload.new.value);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box display={'inline-flex'} alignItems={'center'} gap={2}>
      <LavaTypo variant='p' className='online-counter'>{online}</LavaTypo>
      <FontAwesomeIcon icon={faUserGroup} size='lg' />
    </Box>
  )
}
