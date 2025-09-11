import React from 'react'
import { Flex } from '@chakra-ui/react'
import HeroTypo from '../Design/HeroTypo'
import Logo from '../Design/Logo'
import Cover from '../../assets/cover.jpg'
import CursorButton from '../CursorButton'

export default function Hero() {
    return (
        <div className='landing-hero'
            style={{
                position: 'relative', // Added for absolute positioning context
                backgroundImage: `url(${Cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            <Flex direction='column' width='100%' height='100%' justifyContent={'space-between'} className='landing-hero-content'>
                <HeroTypo />
                <Logo h={76} w={76} />
            </Flex>
            <CursorButton />
        </div>
    )
}
