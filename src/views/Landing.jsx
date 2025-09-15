import React, { useEffect } from 'react'
import AppBar from '@/components/Core/AppBar/AppBar'
import Hero from '@/components/Core/Hero/Hero'
import AboutSection from '@/components/Sections/AboutSection'
import Newsletter from '@/components/Sections/Newsletter'
import { Flex } from '@chakra-ui/react'
import Music from '@/components/Sections/Music'
import './styles/Landing.css'
import NextEvents from '@/components/Sections/NextEvents'
import Videos from '../components/Sections/Videos'

export default function Landing() {
    const [userOS, setUserOS] = React.useState('');

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
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <Hero userOS={userOS} />
                <Flex direction={'column'} className='landing-body' width={'100%'}>
                    <AboutSection />
                    <Music />
                    <Newsletter />
                    <NextEvents />
                    <Videos />
                </Flex>
            </div>
        </div>
    )
}
