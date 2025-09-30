import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { Flex } from '@chakra-ui/react'
import './AppBar.css'
import Socials from './Socials'
import menuItems from '@/lib/menuItems'

export default function AppBar() {
  return (
    <Flex className='app-bar'
      axis={'horizontal'}
      mt={6}
      position={'absolute'}
      top={0}
    >
      <Flex gap={4}>
        <Socials />
        {menuItems.map(item => (
          <LavaButton key={item.name} variant={item.variant} className="app-bar__button" onClick={() => {
            const section = document.querySelector(item.link)
            section.scrollIntoView({ behavior: 'smooth' })
          }}>
            <LavaTypo variant='text'>{item.name}</LavaTypo>
            {item.endIcon && (
              <span className="app-bar__icon-on-hover">
                <item.endIcon strokeWidth={2} />
              </span>
            )}
          </LavaButton>
        ))}
      </Flex>
    </Flex>
  )
}