import React from 'react'
import { Flex } from '@chakra-ui/react'
import LavaTypo from '@/components/Design/LavaTypo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpLong } from '@fortawesome/free-solid-svg-icons'
import './ScrollToTop.css'

export default function ScrollToTop({ isVisible }) {
  return (
    <Flex
      className='scroll-to-top-container'
      style={{ display: isVisible ? 'flex' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <FontAwesomeIcon icon={faArrowUpLong} color='white' className='scroll-to-top-arrow' />
      <LavaTypo className='scroll-to-top-text' size={'16px'}>Top</LavaTypo>
    </Flex>
  )
}
