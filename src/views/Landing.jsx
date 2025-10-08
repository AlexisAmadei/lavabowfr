import React from 'react'
import AppBar from '@/components/Core/AppBar/AppBar'
import Hero from '@/components/Core/Hero/Hero'
import AboutSection from '@/components/Sections/AboutSection'
import Newsletter from '@/components/Sections/Newsletter'
import { Flex } from '@chakra-ui/react'
import Music from '@/components/Sections/Music'
import './styles/Landing.css'
import NextEvents from '../components/Sections/NextEvents/NextEvents'
import Videos from '../components/Sections/Videos'
import Pictures from '../components/Sections/Pictures/Pictures'
import useIsMobile from '@/hooks/useIsMobile'
import ScrollToTop from '@/components/Core/ScrollToTop/ScrollToTop'
import useIsInView from '@/hooks/useIsInView'

export default function Landing() {
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  const isInView = useIsInView(ref, 0.03);

  return (
    <div className='app-wrapper'>

      {!isMobile && <AppBar />}
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
        </Flex>
      </div>
    </div>
  )
}
