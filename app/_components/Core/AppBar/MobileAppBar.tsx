'use client';

import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { scrollToSection } from '@/utils/navigation'
import useMenuItems from '@/hooks/useMenuItems'
import MediaLinks from './MediaLinks'
import Player from '@/components/Design/Player'
import CartButton from './CartButton'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/useTranslation'

export default function MobileAppBar() {
  const [open, setOpen] = React.useState(false)
  const menuItems = useMenuItems()
  const { t } = useTranslation()
  const router = useRouter()

  const handleMenuToggle = () => {
    setOpen(prev => !prev)
  }

  const handleMenuItemClick = (link: string) => {
    if (link.startsWith('#')) {
      scrollToSection(link)
    } else {
      router.push(link)
    }

    setOpen(false)
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

      <Box flexBasis={'1/6'} style={{ position: 'relative' }} display={'inline-flex'} alignItems={'center'} justifyContent={'flex-end'} gap={2}>
        <CartButton size='sm' />
        <div onClick={() => handleMenuToggle()} className='app-bar__menu-burger'>
          <LavaTypo variant='h2' size={24} color='white'>{t.menu.menuLabel}</LavaTypo>
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
              <LavaTypo variant='h2' color='white' onClick={() => handleMenuToggle()} size={24}>{t.menu.close}</LavaTypo>
              <Flex width="100%" direction={'column'} justifyContent={'100%'} alignItems={'flex-end'} gap={4} marginTop={'16px'}>
                {menuItems.map(item => {
                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <Box key={item.name} width={'100%'}>
                        <Flex direction={'column'} alignItems={'flex-end'} gap={3} marginTop={2}>
                          {item.subItems.map(subItem => (
                            <LavaTypo key={subItem.name} color='white' size={16} onClick={() => handleMenuItemClick(subItem.link)}>
                              {subItem.name}
                            </LavaTypo>
                          ))}
                        </Flex>
                      </Box>
                    )
                  } else {
                    return (
                      <LavaTypo key={item.name} color='white' size={18} onClick={() => handleMenuItemClick(item.link)}>
                        {item.name}
                      </LavaTypo>
                    )
                  }
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
