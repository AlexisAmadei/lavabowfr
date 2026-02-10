import React, { useEffect } from 'react'
import Section from '@/components/Design/Section'
import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'
import useIsMobile from '../../hooks/useIsMobile'
import { fetchDataFromTable } from '@/utils/supabase/supabase'
import { Video } from '@/types/types'

export default function Videos() {
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(undefined);
  const isMobile = useIsMobile(1300);
  const [videoList, setVideoList] = React.useState<Video[]>([]);

  useEffect(() => {
    const ref = document.getElementById('featured-video');
    if (ref) {
      console.log('Featured video container height:', ref.clientHeight);
      setMaxHeight(ref.clientHeight);
    }
  }, []);

  useEffect(() => {
    async function fetchVideoList() {
      const data = await fetchDataFromTable('section_videos');

      if (data) {
        // Sort videos by order field
        const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
        setVideoList(sortedData.filter((video) => video.status.toLowerCase() === 'active'));
        console.log('Fetched videos:', sortedData);
      }
    }
    fetchVideoList();
  }, []);

  // Get the featured video (order === 1) and other videos
  const featuredVideo = videoList.find(video => video.order === 1);
  const otherVideos = videoList.filter(video => video.order !== 1);

  if (isMobile) {
    return (
      <Section id={'videos'} title={'Vidéos'}>

        <Flex direction={'column'} gap={6} alignItems={'center'}>
          <LavaTypo variant={'h2'} size={25}>Dernière vidéo</LavaTypo>
          {featuredVideo?.url && (
            <Box width={'350px'}>
              <iframe id="ytplayer" width={'350px'} height={'200px'}
                src={featuredVideo.url}
                name='youtube-embed'
              ></iframe>
            </Box>
          )}
        </Flex>
      </Section>
    )
  }

  return (
    <Section id='videos' title={'Vidéos'}>
      <Flex direction={'column'} gap={8} width={'100%'} alignItems={'center'}>
        <Flex justifyContent={'flex-start'} direction={isMobile ? "column" : "row"} gap={3} height={'100%'}>

          <Flex direction={'column'} gap={3} id='featured-video'>
            <LavaTypo variant={'h2'}>Absolute Cinéma</LavaTypo>
            {featuredVideo?.url && (
              <Box>
                <iframe id="ytplayer" width={isMobile ? "100%" : "996"} height={isMobile ? "300" : "600"}
                  src={featuredVideo.url}
                  name='youtube-embed' loading='lazy'
                ></iframe>
              </Box>
            )}
          </Flex>

          {otherVideos.length > 0 && (
            <Flex className='others-videos'
              direction={'column'}
              gap={3}
              maxH={'672px'}
            >
              <LavaTypo variant={'h3'}>Voir plus</LavaTypo>
              <Box
                className='video-list'
                display={'flex'}
                direction={'column'}
                flexDirection={'column'}
                gap={3}
                overflowY={'auto'}
                justifyContent={'space-between'}
              >
                {otherVideos.map((video) => (
                  video.url && (
                    <iframe key={video.id} id="ytplayer" width={'320px'} height={'180px'}
                      src={video.url}
                      name='youtube-embed' loading='lazy'
                    ></iframe>
                  )
                ))}
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Section>
  )
}
