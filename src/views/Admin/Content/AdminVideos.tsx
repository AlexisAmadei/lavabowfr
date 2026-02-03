import AddVideoDialog from '@/components/Core/Admin/AddVideoDialog'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { supabase } from '@/utils/supabase/supabase'
import { Box, Flex } from '@chakra-ui/react'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface VideoItem {
  id: number;
  description?: string;
  url: string;
  status?: 'active' | 'inactive';
}

export default function AdminVideos() {
  const [open, setOpen] = useState(false);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);

  useEffect(() => {
    async function fetchVideoContent() {
      let { data, error } = await supabase
        .from('section_videos')
        .select('*');

      if (error) {
        console.error('Erreur lors de la récupération des vidéos :', error);
        return;
      }
      setVideoList(data || []);
    }
    fetchVideoContent();
  }, []);

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>Vidéos</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un élément
        </LavaButton>
      </Flex>

      <Flex
        direction={'column'}
        gap={2}
      >
        {videoList.length === 0 ? (
          <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
            Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
          </LavaTypo>
        ) : (
          videoList.map((video) => (
            <Box key={video.id}>
              <p>{video.url}</p>
            </Box>
          )))}
      </Flex>

      {/* <AddVideoDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={async (data) 
      /> */}
    </Box>
  );
}
