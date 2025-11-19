import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Box, Flex } from '@chakra-ui/react'
import CompactDisk from '../Core/CompactDisk/CompactDisk'
import useIsMobile from '@/hooks/useIsMobile'
import { musicLinks } from '@/lib/socialLinks'

export default function Music() {
  const isMobile = useIsMobile();

  return (
    <Section
      bgColor={'var(--secondary-accent)'}
      id='music'
    >
      <LavaTypo variant='h1'>Notre Musique</LavaTypo>
      <Flex
        width={'100%'}
        direction={isMobile ? 'column' : 'row'}
        alignItems={'center'}
        justifyContent={'space-around'}
      >
        <CompactDisk />

        <Flex
          direction={'column'}
          alignItems={'flex-start'}
          justifyContent={'center'}
          gap={4}
          width={isMobile ? '100%' : '50%'}
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

          <Flex direction={'column'} alignItems={'flex-start'} justifyContent={'center'}>
            <LavaTypo variant={'h3'} styles={{ marginTop: '16px' }}>
              Tu peux nous trouver partout sinon
            </LavaTypo>
            <Box className="social-pill" style={{ display: 'inline-flex', alignItems: 'center' }}
              width={'fit-content'}
              backgroundColor={'white'} color={'var(--main-accent)'}
              padding={2}
              gap={4}
              borderRadius={50}
              mt={4}
            >
              {musicLinks.map((link) => (
                <a
                  key={link.name || link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  style={{ display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <link.icon size={40} />
                </a>
              ))}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Section>
  )
}