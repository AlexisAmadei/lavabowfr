import AddVideoDialog from '@/components/Core/Admin/AddVideoDialog'
import AdminItemMenu from '@/components/Core/Admin/AdminItemMenu'
import LavaTypo from '@/components/Design/LavaTypo'
import StatusChip from '@/components/ui/StatusChip'
import { supabase } from '@/utils/supabase/supabase'
import { updateItemStatus } from '@/utils/supabase/updateItemStatus'
import { Box, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface VideoItem {
  id: number;
  description?: string;
  url: string;
  status: 'active' | 'inactive';
}

export default function AdminVideos({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
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

    const handleAddVideo = async (data: { description?: string; url?: string; status: 'active' | 'inactive' | string }) => {
      const { error } = await supabase
        .from('section_videos')
        .insert({
          description: data.description,
          url: data.url,
          status: data.status
        });

      if (error) {
        console.error('Erreur lors de l\'ajout de la vidéo :', error);
        return;
      }

      // Refresh the list
      const { data: newData } = await supabase
        .from('section_videos')
        .select('*');

      if (newData) {
        setVideoList(newData);
      }

      setOpen(false);
    };

    const handleUpdateStatus = async (videoId: number) => {
      const updatedVideos = await updateItemStatus('section_videos', videoId, videoList.find(v => v.id === videoId)?.status || '');
      if (updatedVideos) {
        setVideoList(updatedVideos);
      }
    }

    function videoElement({ label, element = "N/A" }: { label: string, element?: string }) {
      return (
        <Flex direction={'row'} alignItems={'center'} gap={2}>
          <LavaTypo variant={'p'} styles={{ color: 'black', fontWeight: 'bold' }}>{label}</LavaTypo>
          <LavaTypo variant={'p'} styles={{ color: 'black' }}>
            {element}
          </LavaTypo>
        </Flex>
      )
    }

    return (
      <Box direction={'column'}>
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
              <Flex key={video.id}
                direction={'row'}
                justifyContent={'space-between'}
                color={'black'}
                px={'4'}
                py={'2'}
                gap={1}
                borderRadius={'md'}
                borderWidth={'1px'}
                borderColor={'gray.200'}
                width={'full'}
                position={'relative'}
                backgroundColor={'gray.50'}
              >
                <Box>
                  {videoElement({
                    label: 'Description:',
                    element: video.description
                  })}
                  {videoElement({
                    label: 'URL:',
                    element: video.url
                  })}
                </Box>

                <StatusChip status={video.status || ''} />

                <AdminItemMenu
                  itemId={video.id}
                  itemStatus={video.status || ''}
                  onUpdateStatus={() => handleUpdateStatus(video.id)}
                  onDelete={() => console.log('Delete video', video.id)}
                />
              </Flex>
            )))}
        </Flex>

        <AddVideoDialog
          open={open}
          onClose={() => setOpen(false)}
          onAdd={handleAddVideo}
        />
      </Box>
    );
  }
