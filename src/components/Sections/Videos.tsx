import React, { useEffect } from 'react'
import Section from '@/components/Design/Section'
import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'
import useIsMobile from '../../hooks/useIsMobile'
import { fetchDataFromTable } from '@/utils/supabase/supabase'
import { Video } from '@/types/types'
import ReactPlayer from 'react-player'
import { useTranslation } from '@/i18n/useTranslation'

export default function Videos() {
  const isMobile = useIsMobile(1300);
  const [videoList, setVideoList] = React.useState<Video[]>([]);
  const { t } = useTranslation();

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
      <Section id={'videos'} title={t.videos.title}>

        <Flex direction={'column'} gap={6} alignItems={'center'}>
          <LavaTypo variant={'h2'} size={25}>{t.videos.latest}</LavaTypo>
          {featuredVideo?.url && (
            <Box width={'350px'}>
              <ReactPlayer
                src={featuredVideo.url}
                width={'350px'}
                height={'200px'}
              />
            </Box>
          )}
        </Flex>
      </Section>
    )
  }

  return (
    <Section id='videos' title={t.videos.title}>
      <Flex direction={'column'} gap={8} width={'100%'} alignItems={'center'}>
        <Flex justifyContent={'flex-start'} direction={isMobile ? "column" : "row"} gap={3} height={'100%'}>

          <Flex direction={'column'} gap={3} id='featured-video'>
            <LavaTypo variant={'h2'}>{t.videos.featured}</LavaTypo>
            {featuredVideo?.url && (
              <Box>
                <ReactPlayer
                  src={featuredVideo.url}
                  width={isMobile ? "100%" : "996px"}
                  height={isMobile ? "300px" : "600px"}
                />
              </Box>
            )}
          </Flex>

          {otherVideos.length > 0 && (
            <Flex className='others-videos'
              direction={'column'}
              gap={3}
              maxH={'672px'}
            >
              <LavaTypo variant={'h3'}>{t.videos.seeMore}</LavaTypo>
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
                    <ReactPlayer
                      key={video.id}
                      src={video.url}
                      width={isMobile ? "100%" : "320px"}
                      height={isMobile ? "200px" : "180px"}
                    />
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
