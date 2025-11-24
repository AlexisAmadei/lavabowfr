import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { Box, Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import { scrollToSection } from '@/utils/navigation'

// eslint-disable-next-line
import { motion } from 'motion/react'
import menuItems from '@/lib/menuItems'
import GlassSurface from '@/components/react-bits/GlassSurface/GlassSurface'

export default function MobileAppBar() {
  const [open, setOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  const handleMenuToggle = () => {
    if (open) {
      setIsClosing(true)
      setTimeout(() => {
        setOpen(false)
        setIsClosing(false)
      }, 400) // Match animation duration
    } else {
      setOpen(true)
    }
  }
  return (
    <Flex
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      w={'100%'}
      paddingX={6}
      paddingTop={6}
    >
      <div className="app-bar__logo">
        <Logo h={50} w={50} />
      </div>
      <div style={{ position: 'relative' }}>
        <div onClick={() => handleMenuToggle()} className='app-bar__menu-burger'>
          <LavaTypo variant='h3'>Menu</LavaTypo>
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
            <Box
              onClick={() => handleMenuToggle()}
              className={`app-bar__menu-burger ${isClosing ? 'mobile-menu-closing' : 'mobile-menu-animation'}`}
              display={'flex'}
              paddingY={'24px'}
              paddingX={'16px'}
              flexDirection={'column'}
              alignItems={'flex-end'}
              justifyContent={'flex-start'}
              gap={'16px'}
              position={'fixed'}
              top={0}
              right={0}
              zIndex={10}
            >
              <GlassSurface
                width={'100%'}
                height={'fit-content'}
                className="my-custom-class"
              >
                <Flex direction={'column'} alignItems={'flex-end'} justifyContent={'flex-end'} width={'100%'}>
                  <LavaTypo variant='h3'>Close</LavaTypo>
                  <VStack spacing={2} alignItems={'flex-end'}>
                    {menuItems.map(item => (
                      <LavaTypo variant={'text'} key={item.name} onClick={() => scrollToSection(item.link)}>
                        {item.name}
                      </LavaTypo>
                    ))}
                  </VStack>
                </Flex>
              </GlassSurface>
            </Box>
          </>
        )}
      </div>
    </Flex>
  )
}
