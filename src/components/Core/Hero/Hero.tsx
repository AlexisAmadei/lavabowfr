import { Box, Flex } from '@chakra-ui/react'
import Spotlight from './Spotlight'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'
import MobileAppBar from '../AppBar/MobileAppBar'
import MediaLinks from '../AppBar/MediaLinks'
import ReactPlayer from 'react-player'
import { useGetGlobalVar } from '@/hooks/useGetGlobalVar'

export default function Hero() {
  const isMobile = useIsMobile();
  const heroVideoUrl = useGetGlobalVar('HERO_VIDEO_URL') || '';

  return (
    <div className='landing-hero'
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background Video */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}>
        <ReactPlayer
          src={heroVideoUrl}
          playing
          loop
          muted
          width={isMobile ? '177.78vh' : '100%'}
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: isMobile ? '50%' : 0,
            transform: isMobile ? 'translateX(-50%)' : undefined,
          }}
        />
        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }} />
      </div>

      {/* Content layer */}
      <Flex
        position={'relative'}
        zIndex={2}
        minH={'100vh'}
        direction='column'
        width='100%'
        height='100%'
        justifyContent={'space-between'}
      >
        {isMobile && <MobileAppBar />}
        <Flex
          className='landing-hero-content'
          direction='column'
          width='100%'
          height='100%'
          justifyContent={'space-between'}
          marginTop={isMobile ? '100px' : 0}
        >
          <HeroTypo />
          <Box
            className='hero-bottom'
            width={'100%'}
            display={'flex'}
            flexDirection={isMobile ? 'column' : 'row'}
            position={'relative'}
            alignItems={isMobile ? 'center' : 'flex-end'}
            justifyContent={'flex-end'}
            paddingX={!isMobile ? 16 : 4}
            mb={8}
            gap={isMobile ? '24px' : 0}
          >
            <Spotlight />
            {isMobile && <MediaLinks padding='6px' />}
          </Box>
        </Flex>
      </Flex>
    </div >
  )
}
