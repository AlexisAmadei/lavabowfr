import React from 'react'
import AppBar from '../components/AppBar'
import Hero from '../components/Hero/Hero'
import AboutSection from '../components/AboutSection'
import Newsletter from '../components/Newsletter'
import { Flex } from '@chakra-ui/react'
import Music from '@/components/Music'
import './styles/Landing.css'
import NextEvents from '@/components/Sections/NextEvents'

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
                </Flex>
            </div>
        </div>
    )
}
