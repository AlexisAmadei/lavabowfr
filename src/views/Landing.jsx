import React from 'react'
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
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <Hero />
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
