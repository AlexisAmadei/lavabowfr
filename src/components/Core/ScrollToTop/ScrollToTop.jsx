import React from 'react'
import { Button } from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import './ScrollToTop.css'

export default function ScrollToTop() {
  return (
    <div className='scroll-to-top-container'>
      <Button
        className='scroll-to-top-button'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TO TOP <FaArrowRight />
      </Button>
    </div>
  )
}
