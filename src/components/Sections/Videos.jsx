import React, { useEffect } from 'react'
import Section from '@/components/Design/Section'
import { Box, Flex, ScrollArea } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'
import useIsMobile from '../../hooks/useIsMobile'

const styles = {
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%' /* 16:9 aspect ratio */,
    paddingTop: 25,
    height: 0,
  },
}

const videoList = [
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=0",
  },
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
  },
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
  },
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
  },
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
  },
  {
    link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
  },
]

export default function Videos() {
  const [maxHeight, setMaxHeight] = React.useState();
  const isMobile = useIsMobile(1300);

  useEffect(() => {
    const ref = document.getElementById('featured-video');
    if (ref) {
      setMaxHeight(ref.clientHeight);
    }
  }, []);

  return (
    <Section id='videos' title={'Vidéos'}>
      <Flex direction={'column'} gap={8} width={'100%'} alignItems={'center'}>

        <Flex justifyContent={'flex-start'} direction={isMobile ? "column" : "row"} gap={3} height={'100%'}>
          <Flex direction={'column'} gap={3} id='featured-video'>
            <LavaTypo variant={'h2'}>Dernier clip</LavaTypo>
            <Box sx={styles.videoContainer}>
              <iframe id="ytplayer" type="text/html" width={isMobile ? "100%" : "996"} height={isMobile ? "300" : "600"}
                src="https://www.youtube.com/embed/Rbszi6x8mXE?autoplay=0&controls=1"
                name='youtube-embed' loading='lazy'
              ></iframe>
            </Box>
          </Flex>

          {isMobile ? (
            <Box width={'100%'}>
              <ScrollArea.Root width="100%" size="xs">
                <ScrollArea.Viewport>
                  <ScrollArea.Content py="4">
                    <Flex gap="4" flexWrap="nowrap">
                      {videoList.map((video, index) => (
                        <Box rounded="sm" key={index} flexShrink="0">
                          {/* <img src={`https://placehold.co/250x141`} alt={`Placeholder ${i + 1}`} style={{ borderRadius: '2px', width: '100%', height: 'auto' }} /> */}
                          <iframe key={index} id="ytplayer" type="text/html" width={isMobile ? '165px' : '320px'} height={isMobile ? '93px' : '180px'}
                            src={video.link}
                            name='youtube-embed' loading='lazy'
                          ></iframe>
                        </Box>
                      ))}
                    </Flex>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="horizontal" />
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </Box>
          ) : (
            <Flex
              direction={'column'}
              maxHeight={maxHeight ?? '400px'}
              gap={3}
            >
              <LavaTypo variant={'h3'}>Autres vidéos</LavaTypo>
              <Box
                className='video-list'
                display={'flex'}
                direction={'column'}
                flexDirection={'column'}
                gap={3}
                overflowY={'auto'}
                justifyContent={'space-between'}
              >
                {videoList.map((video, index) => (
                  <iframe key={index} id="ytplayer" type="text/html" width={'320px'} height={'180px'}
                    src={video.link}
                    name='youtube-embed' loading='lazy'
                  ></iframe>
                ))}
              </Box>
            </Flex>
          )}

        </Flex>
      </Flex>
    </Section>
  )
}
