import React, { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Spotlight from './Spotlight'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'
import MobileAppBar from '../AppBar/MobileAppBar'
import MediaLinks from '../AppBar/MediaLinks'

export default function Hero() {
  const isMobile = useIsMobile();

  const [coverImage, setCoverImage] = React.useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (isMobile) {
        const image = await import('@/assets/img/cover-mobile.webp');
        setCoverImage(image.default);
      } else {
        const image = await import('@/assets/img/cover.webp');
        setCoverImage(image.default);
      }
    };
    loadImage();
  }, [isMobile]);

  return (
    <div className='landing-hero'
      style={{
        position: 'relative',
        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
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
    </div >
  )
}
