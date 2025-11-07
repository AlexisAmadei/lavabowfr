import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import menuItems from '@/lib/menuItems'
import { Box, Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import { motion } from 'motion/react'
import { scrollToSection } from '@/utils/navigation'

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
          <>
            <div
              onClick={() => handleMenuToggle()}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9
              }}
            />
            <motion.div
              transition={{ duration: 0.3, ease: 'easeOut' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ transformOrigin: 'top right', position: 'fixed', top: 0, right: 0, zIndex: 10 }}
            >

              <Box
                onClick={() => handleMenuToggle()}
                className={'app-bar__menu-burger'}
                display={'flex'}
                width={'100vw'}
                paddingBottom={'24px'}
                paddingLeft={'16px'}
                paddingRight={'16px'}
                paddingTop={'24px'}
                flexDirection={'column'}
                alignItems={'flex-end'}
                justifyContent={'flex-start'}
                gap={'16px'}

                position={'fixed'}
                top={0}
                right={0}
                zIndex={10}
                backgroundColor={'var(--Background-bg-brand)'}
              >
                <LavaTypo variant='h3'>Close</LavaTypo>
                <VStack spacing={2} alignItems={'flex-end'}>
                  {menuItems.map(item => (
                    <LavaTypo variant={'text'} key={item.name} onClick={() => scrollToSection(item.link)}>
                      {item.name}
                    </LavaTypo>
                  ))}
                </VStack>
              </Box>
            </motion.div>
          </>
        )}
      </div>
    </Flex>
  )
}
