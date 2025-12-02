import React, { useEffect } from 'react'
import { Box, Flex, Menu } from '@chakra-ui/react'
import Logo from '@/components/Design/Logo'
import Spotlight from './Spotlight'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'
import MobileAppBar from '../AppBar/MobileAppBar'
import MediaLinks from '../AppBar/MediaLinks'
import LavaTypo from '@/components/Design/LavaTypo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

const contextMenuItems = [
  { name: 'Télécharger notre logo en .svg' },
  { name: 'Télécharger notre logo en .png' },
  { name: 'Télécharger notre press kit' },
]

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
                <Logo h={'76'} w={'76'} />
              </Menu.ContextTrigger>

              <Menu.Positioner backgroundColor={'transparent'}>
                <Menu.Content
                  backgroundColor={'#171717ff'}
                  color={'white'}
                  borderRadius={'16px'}
                  padding={3}
                >
                  <Flex
                    direction='column'
                    gap={1}
                  >
                    <LavaTypo variant='accent' size={12} style={{ marginLeft: '8px '}}>LAVA BOW Design System</LavaTypo>
                    {contextMenuItems.map((item, index) => (
                      <Flex key={index}
                        borderRadius={'10px'}
                        padding={2}
                        gap={4}
                        justifyContent={'space-between'}
                        _hover={{ backgroundColor: '#ffffff27', cursor: 'pointer' }}
                      >
                        <LavaTypo variant='p' size={14}>{item.name}</LavaTypo>
                        <FontAwesomeIcon icon={faDownload} />
                      </Flex>
                    ))}
                  </Flex>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}

          <Spotlight />
          {isMobile && <MediaLinks padding='6px' />}
        </Box>
      </Flex>
    </div >
  )
}
