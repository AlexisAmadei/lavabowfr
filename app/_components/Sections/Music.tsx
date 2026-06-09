import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Box, Flex } from '@chakra-ui/react'
import CompactDisk from '../Core/CompactDisk/CompactDisk'
import useIsMobile from '@/hooks/useIsMobile'
import MediaLinks from '../Core/AppBar/MediaLinks'
import { useTranslation } from '@/i18n/useTranslation'
import { useEffect, useState } from 'react'

export default function Music() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
          ml={isMobile ? 0 : 16}
        >
          <LavaTypo variant={'h2'}>{t.music.singlesHeading}</LavaTypo>

          <Flex
            direction={'column'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            width={'100%'}
            gap={2}
          >
            {mounted && (
              <iframe style={{
                border: 0,
                width: isMobile ? '100%' : '700px',
                height: '470px'
              }}
                src="https://bandcamp.com/EmbeddedPlayer/album=1637602018/size=large/bgcol=333333/linkcol=9a64ff/artwork=small/transparent=true/" seamless />
            )}
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