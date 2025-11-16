import React from 'react'
import { Flex } from '@chakra-ui/react'
import { LuArrowUp } from 'react-icons/lu'
import './ScrollToTop.css'
import LavaTypo from '@/components/Design/LavaTypo'

export default function ScrollToTop({ isVisible }) {
  return (
    <Flex
      className='scroll-to-top-container'
      style={{ display: isVisible ? 'flex' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <LuArrowUp className='scroll-to-top-arrow' size={25} />
      <LavaTypo className='scroll-to-top-text' size={'16px'}>Top</LavaTypo>
    </Flex>
  )
}
