import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { Flex } from '@chakra-ui/react'
import './AppBar.css'
import Socials from './Socials'
import menuItems from '@/lib/menuItems'
import { scrollToSection } from '@/utils/navigation'

export default function AppBar() {
  return (
    <Flex className='app-bar'
      axis={'horizontal'}
      mt={6}
      position={'absolute'}
      top={0}
      justifyContent={'center'}
    >
      <Flex gap={4}>
        <Socials />
        {menuItems.map(item => (
          <LavaButton key={item.name} variant={item.variant} className="app-bar__button" onClick={() => scrollToSection(item.link)}>
            <LavaTypo variant='text'>{item.name}</LavaTypo>
            {item.endIcon && (
              <span className="app-bar__icon-on-hover">
                <item.endIcon strokeWidth={1} size={30} />
              </span>
            )}
          </LavaButton>
        ))}
      </Flex>
    </Flex>
  )
}