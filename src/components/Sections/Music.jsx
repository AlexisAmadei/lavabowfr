import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Box, Flex } from '@chakra-ui/react'
import CompactDisk from '../Core/CompactDisk/CompactDisk'
import useIsMobile from '@/hooks/useIsMobile'
import MediaLinks from '../Core/AppBar/MediaLinks'

export default function Music() {
  const isMobile = useIsMobile();

  return (
    <Section
      bgColor={'var(--secondary-accent)'}
      id='music'
      title={'Notre Musique'}
    >
      <Flex
        width={'100%'}
        direction={isMobile ? 'column' : 'row'}
        alignItems={'center'}
        justifyContent={'space-around'}
      >
        <CompactDisk />

        <Flex
          direction={'column'}
          alignItems={isMobile ? 'center' : 'flex-start'}
          justifyContent={'center'}
          gap={4}
          width={isMobile ? '100%' : '50%'}
          marginTop={isMobile ? 8 : 0}
        >
          <LavaTypo variant={'h2'}>Dernière sortie</LavaTypo>

          {/* Apple embed */}
          <iframe
            allow="autoplay ; encrypted-media; fullscreen *; clipboard-write"
            frameborder="0"
            height="175"
            style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/fr/song/smoking-man-in-a-cave-feat-lea/1845660528"
          ></iframe>

          <Flex direction={'column'} alignItems={isMobile ? 'center' : 'flex-start'} justifyContent={'center'}>
            <LavaTypo variant={'h3'} size={'30px'} styles={{ marginTop: '16px' }}>
              Tu peux nous trouver partout sinon
            </LavaTypo>
            <Box className="social-pill" style={{ display: 'inline-flex', alignItems: 'center' }}
              width={'fit-content'}
              backgroundColor={'white'} color={'var(--main-accent)'}
              pt={isMobile ? 1 : 2}
              px={2}
              gap={4}
              borderRadius={50}
              mt={4}
            >
              <MediaLinks content='media' size='2x' color='var(--main-accent)' padding='0' />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Section>
  )
}