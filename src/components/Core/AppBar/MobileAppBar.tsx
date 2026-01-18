import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { scrollToSection } from '@/utils/navigation'
import menuItems from '@/lib/menuItems'
import MediaLinks from './MediaLinks'
import LavaButton from '@/components/Design/LavaButton'
import Player from '@/components/Design/Player'

export default function MobileAppBar() {
  const [open, setOpen] = React.useState(false)

  const handleMenuToggle = () => {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const handleMenuItemClick = (link: string) => {
    scrollToSection(link)
    handleMenuToggle()
  }

  return (
    <Flex
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      w={'100%'}
      paddingX={6}
      paddingTop={4}

      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
    >
      <Box flexBasis={'1/6'} className="app-bar__logo">
        <Logo h={'50'} w={'50'} />
      </Box>

      <Box flexBasis={'4/6'} textAlign={'center'}>
        <Player isMobile={true} />
      </Box>

      <Box flexBasis={'1/6'} style={{ position: 'relative' }}>
        <div onClick={() => handleMenuToggle()} className='app-bar__menu-burger'>
          <LavaTypo variant='h2' size={24} color='white'>Menu</LavaTypo>
        </div>
        {open && (
          <>
            <div
              onClick={() => handleMenuToggle()}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 9
              }}
            />
            <Flex
              className={`app-bar__menu-burger`}
              direction={'column'}
              alignItems={'flex-end'}
              justifyContent={'flex-start'}
              gap={5}
              padding={6}
              position={'fixed'}
              top={0}
              right={0}
              zIndex={10}
              width={'100%'}
              backgroundColor={'var(--Background-bg-brand)'}
            >
              <LavaTypo variant='h2' color='white' onClick={() => handleMenuToggle()} size={24}>Close</LavaTypo>
              <Flex width="100%" direction={'column'} justifyContent={'100%'} alignItems={'flex-end'} gap={4} marginTop={'16px'}>
                {menuItems.map(item => {
                  if (item.variant === 'filled') {
                    return (
                      <LavaButton variant='filled' color='secondary' key={item.name} onClick={() => handleMenuItemClick(item.link)}>
                        <LavaTypo size={18}>{item.name}</LavaTypo>
                      </LavaButton>
                    )
                  }
                  return (
                    <LavaTypo key={item.name} size={18} onClick={() => handleMenuItemClick(item.link)}>
                      {item.name}
                    </LavaTypo>
                  )
                })}
              </Flex>
              <MediaLinks padding='8px' />
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  )
}
