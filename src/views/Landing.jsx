import React, { useEffect, useState } from 'react'
import Hero from '@/components/Core/Hero/Hero'
import AboutSection from '@/components/Sections/AboutSection'
import Newsletter from '@/components/Sections/Newsletter'
import { Box, Flex } from '@chakra-ui/react'
import Music from '@/components/Sections/Music'
import './styles/Landing.css'
import useIsMobile from '@/hooks/useIsMobile'
import ScrollToTop from '@/components/Core/ScrollToTop/ScrollToTop'
import useIsInView from '@/hooks/useIsInView'
import Footer from '@/components/Sections/Footer'
import ClickSection from '@/components/Sections/ClickSection/ClickSection'
import Contact from '@/components/Sections/Contact'
import { Toaster } from '@/components/ui/toaster'
import AppBar from '@/components/Core/AppBar/AppBar'
import { Analytics } from '@vercel/analytics/react'

const Videos = React.lazy(() => import('../components/Sections/Videos'));
const Pictures = React.lazy(() => import('../components/Sections/Pictures/Pictures'));
const NextEvents = React.lazy(() => import('../components/Sections/NextEvents/NextEvents'));

export default function Landing() {
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  const isInView = useIsInView(ref, 0.03);

  return (
    <div className='app-wrapper'>
      {!isMobile && (
        <Box position={'fixed'} top={0} left={0} right={0} zIndex={1000}>
          <AppBar />
        </Box>
      )}
      <div className='landing-page'>
        <Hero />
        <Flex ref={ref} direction={'column'} className='landing-body' width={'100%'} overflow={'hidden'}>
          <ScrollToTop isVisible={isInView} />
          <AboutSection />
          <Music />
          <Newsletter />
          <NextEvents />
          <Videos />
          <Pictures />
          <ClickSection />
          <Contact />
          <Footer />
        </Flex>
      </div>
      <Toaster />
    </div>
  )
}
