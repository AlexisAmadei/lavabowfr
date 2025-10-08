import { Button } from '@chakra-ui/react'
import React from 'react'
import './ScrollToTop.css'
import { FaArrowRight } from 'react-icons/fa'

export default function ScrollToTop() {

  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="injected-svg" data-src="https://static.elfsight.com/icons/app-back-to-top-arrow-3.svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="m7.997 10 3.515-3.79a.672.672 0 0 1 .89-.076l.086.075L16 10l-3 .001V18h-2v-7.999L7.997 10z"></path></svg>
  )
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
