import React from 'react'
import './styles/Landing.css'
import AppBar from '../components/AppBar'
import Hero from '../components/Hero/Hero'
import AboutSection from '../components/AboutSection'
import Newsletter from '../components/Newsletter'
import { Flex } from '@chakra-ui/react'

export default function Landing() {
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <Hero />
                <Flex direction={'column'} gap={'28'} className='landing-body' style={{ minHeight: '200px', padding: '2rem 0' }}>
                    <AboutSection />
                    <Newsletter />
                </Flex>
            </div>
        </div>
    )
}
