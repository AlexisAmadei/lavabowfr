import React, { useEffect, useState } from 'react'
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

export default function Landing() {
  const isMobile = useIsMobile();
  const [AppBar, setAppBar] = useState(null);

  useEffect(() => {
    if (!isMobile) {
      import('@/components/Core/AppBar/AppBar')
        .then((module) => {
          setAppBar(() => module.default);
        })
        .catch((error) => {
          console.error('Error loading AppBar:', error);
        });
    } else {
      setAppBar(null);
    }
  }, [isMobile]);

  return (
    <div className='app-wrapper'>
      {!isMobile && AppBar && <AppBar />}
      <div className='landing-page'>
        <Hero />
        <Flex direction={'column'} className='landing-body' width={'100%'} overflow={'hidden'}>
          <ScrollToTop />
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
