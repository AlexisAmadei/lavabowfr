import React, { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Logo from '@/components/Design/Logo'
import Spotlight from './Spotlight'
import CursorButton from '../CursorButton/CursorButton'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'
import MobileAppBar from '../AppBar/MobileAppBar'

export default function Hero() {
  const isMobile = useIsMobile();

  const [coverImage, setCoverImage] = React.useState(null);

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
        paddingTop: '8px'
      }}
    >
      {isMobile && <MobileAppBar />}
      <Flex direction='column' width='100%' height='100%' justifyContent={'space-between'} className='landing-hero-content'>
        <HeroTypo />
        <Box
          className='hero-bottom'
          width={'100%'}
          display={'flex'}
          flexDirection={'row'}
          position={'relative'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
          paddingX={!isMobile ? 16 : 4}
          mb={8}
        >
          {!isMobile && <Logo h={76} w={76} />}
          <Spotlight />
        </Box>
      </Flex>
      {!isMobile && <CursorButton />}
    </div>
  )
}
