import React, { useEffect, useState } from 'react'
// Remove the static AppBar import
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
  const [userOS, setUserOS] = useState('');
  const [AppBar, setAppBar] = useState(null);

  function getOperatingSystem(window) {
    let operatingSystem = 'Not known';
    if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
    if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
    if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
    if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }

    return operatingSystem;
  }

  useEffect(() => {
    console.log(`User OS: ${getOperatingSystem(window)}`);
    localStorage.setItem('userOS', getOperatingSystem(window));
    setUserOS(getOperatingSystem(window));
  }, []);

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
        <Hero userOS={userOS} />
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
