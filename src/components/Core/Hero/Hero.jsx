import React, { useEffect } from 'react'
import { Box, Flex, Menu } from '@chakra-ui/react'
import Logo from '@/components/Design/Logo'
import Spotlight from './Spotlight'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'
import MobileAppBar from '../AppBar/MobileAppBar'
import MediaLinks from '../AppBar/MediaLinks'
import LavaTypo from '@/components/Design/LavaTypo'
import { Link } from 'react-router'

const LinkHoverStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '4px 8px',
}

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
      }}
    >
      {isMobile && <MobileAppBar />}
      <Flex direction='column' width='100%' height='100%' justifyContent={'space-between'} className='landing-hero-content'>
        <HeroTypo />
        <Box
          className='hero-bottom'
          width={'100%'}
          display={'flex'}
          flexDirection={isMobile ? 'column' : 'row'}
          position={'relative'}
          alignItems={isMobile ? 'center' : 'flex-end'}
          justifyContent={'space-between'}
          paddingX={!isMobile ? 16 : 4}
          mb={8}
          gap={isMobile ? '24px' : 0}
        >
          {!isMobile && (
            <Menu.Root>
              <Menu.ContextTrigger>
                <Logo h={76} w={76} />
              </Menu.ContextTrigger>
              <Menu.Positioner backgroundColor={'transparent'}>
                <Menu.Content backgroundColor={'#252525'} color={'white'} borderRadius={'12px'}>
                  <Flex p={2} direction={'column'} textAlign={'left'} gap={1}>
                    <Link to={''} className='link-hover' style={LinkHoverStyle}>Acceder au kit de presse</Link>
                    <Link to={'mailto:contact@lavabow.fr'} className='link-hover' style={LinkHoverStyle}>Mailto contact@lavabow.fr</Link>
                  </Flex>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}
          <Spotlight />
          {isMobile && <MediaLinks padding='6px' />}
        </Box>
      </Flex>
    </div>
  )
}
