import React, { useEffect } from 'react'
import Hero from '@/components/Core/Hero/Hero'
import AboutSection from '@/components/Sections/AboutSection'
import Newsletter from '@/components/Sections/Newsletter'
import Music from '@/components/Sections/Music'
import ScrollToTop from '@/components/Core/ScrollToTop/ScrollToTop'
import Footer from '@/components/Sections/Footer'
import ClickSection from '@/components/Sections/ClickSection/ClickSection'
import Contact from '@/components/Sections/Contact'
import { Toaster } from '@/components/ui/toaster'
import AppBar from '@/components/Core/AppBar/AppBar'

import { Flex } from '@chakra-ui/react'
import useIsMobile from '@/hooks/useIsMobile'
import useIsInView from '@/hooks/useIsInView'

import './styles/Landing.css'
import { getOrCreateClientId, updateLastSeen, deleteOnlineUser } from '@/utils/clientId'

const Videos = React.lazy(() => import('../components/Sections/Videos'));
const Pictures = React.lazy(() => import('../components/Sections/Pictures/Pictures'));
const NextEvents = React.lazy(() => import('../components/Sections/NextEvents/NextEvents'));

export default function Landing() {
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  const isInView = useIsInView(ref, 0.03);

  useEffect(() => {
    const clientId = getOrCreateClientId();

    const interval = setInterval(() => updateLastSeen(clientId), 30000);
    updateLastSeen(clientId);

    return () => {
      clearInterval(interval);
      deleteOnlineUser(clientId);
    };
  }, []);

  return (
    <div className='app-wrapper'>
      {!isMobile && <AppBar />}
      <div className='landing-page'>
        <Hero />
        <Flex ref={ref} direction='column' className='landing-body' width='100%' overflow='hidden'>
          <ScrollToTop isVisible={isInView} />
          <NextEvents />
          <AboutSection />
          <Music />
          <Newsletter />
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
