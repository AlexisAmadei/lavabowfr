import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import menuItems from '@/lib/menuItems'
import { Box, Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import { motion } from 'motion/react'

export default function MobileAppBar() {
  const [open, setOpen] = React.useState(false)

  const handleMenuToggle = () => {
    setOpen(!open)
  }
  return (
    <Flex
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      w={'100%'}
      paddingX={4}
    >
      <div className="app-bar__logo">
        <Logo h={50} w={50} />
      </div>
      <div style={{ position: 'relative' }}>
        <div onClick={() => handleMenuToggle()} className='app-bar__menu-burger'>
          <LavaTypo variant='h3'>Menu</LavaTypo>
        </div>
        {open && (
          <motion.div
            transition={{ duration: 0.5, ease: [0, 0, 1, 1] }}
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh' }}
          >

            <Box
              onClick={() => handleMenuToggle()}
              className={'app-bar__menu-burger'}
              display={'flex'}
              width={'100vw'}
              paddingBottom={'24px'}
              paddingLeft={'16px'}
              paddingRight={'16px'}
              paddingTop={'8px'}
              flexDirection={'column'}
              alignItems={'flex-end'}
              justifyContent={'flex-start'}
              gap={'16px'}

              position={'absolute'}
              top={'0'}
              right={'-16px'}
              zIndex={10}
              border={'var(--Border-border-size-s, 1px) solid var(--Border-border-primary, #FFF)'}
              backdropFilter={'blur(4px)'}
            >
              <LavaTypo variant='h3'>Close</LavaTypo>
              <VStack spacing={2} alignItems={'flex-end'}>
                {menuItems.map(item => (
                  <LavaTypo variant={'text'} key={item.name} onClick={() => {
                    const section = document.querySelector(item.link)
                    section.scrollIntoView({ behavior: 'smooth' })
                  }}>
                    {item.name}
                  </LavaTypo>
                ))}
              </VStack>
            </Box>
          </motion.div>
        )}
      </div>
    </Flex>
  )
}
