import React from 'react'
import './styles/Landing.css'
import AppBar from '../components/AppBar'
import Hero from '../components/Hero/Hero'
import AboutSection from '../components/AboutSection'
import Newsletter from '../components/Newsletter'
import { Flex } from '@chakra-ui/react'
import Music from '@/components/Music'

export default function Landing() {
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <Hero />
                <Flex direction={'column'} className='landing-body'>
                    <AboutSection />
                    <Music />
                    {/* <Newsletter /> */}
                </Flex>
            </div>
        </div>
    )
}
