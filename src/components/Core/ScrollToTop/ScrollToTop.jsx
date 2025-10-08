import React, { useEffect } from 'react'
import { Button } from '@chakra-ui/react'
import './ScrollToTop.css'
import { FaArrowRight } from 'react-icons/fa'

export default function ScrollToTop({ isVisible }) {

  return (
    <div className='scroll-to-top-container' style={{ display: isVisible ? 'block' : 'none' }}>
      <Button
        className='scroll-to-top-button'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TO TOP <FaArrowRight />
      </Button>
    </div>
  )
}
