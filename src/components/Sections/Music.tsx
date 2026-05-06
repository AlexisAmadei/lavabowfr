import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Box, Flex } from '@chakra-ui/react'
import CompactDisk from '../Core/CompactDisk/CompactDisk'
import useIsMobile from '@/hooks/useIsMobile'
import MediaLinks from '../Core/AppBar/MediaLinks'
import { useTranslation } from '@/i18n/useTranslation'

export default function Music() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Section
      bgColor={'var(--secondary-accent)'}
      id='music'
      title={t.music.title}
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
          width={isMobile ? '100%' : '60%'}
          marginTop={isMobile ? 8 : 0}
        >
          <LavaTypo variant={'h2'}>{t.music.singlesHeading}</LavaTypo>

          <Flex
            direction={'column'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            width={'100%'}
            gap={2}
          >
            <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" height="175" width={'100%'} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/grief-song/1876511110?i=1876511111&theme=auto"></iframe>
            <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" height="175" width={'100%'} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/smoking-man-in-a-cave-feat-lea/1845660527?i=1845660528&theme=auto"></iframe>
            <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" height="175" width={'100%'} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/big-fish/1817805911?i=1817805912&theme=auto"></iframe>
          </Flex>


          <Flex direction={'column'} alignItems={isMobile ? 'center' : 'flex-start'} justifyContent={'center'}>
            <LavaTypo variant={'h3'} size={'30px'} styles={{ marginTop: '16px' }}>
              {t.music.findUsEverywhere}
            </LavaTypo>
            <Box style={{ display: 'inline-flex', alignItems: 'center' }}
              width={'fit-content'}
              backgroundColor={'white'} color={'var(--main-accent)'}
              py={isMobile ? 1 : 1}
              px={2}
              gap={4}
              borderRadius={3}
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