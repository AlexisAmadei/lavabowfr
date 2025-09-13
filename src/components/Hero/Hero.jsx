import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import HeroTypo from '../Design/HeroTypo'
import Logo from '../Design/Logo'
import Cover from '../../assets/cover.webp'
import CursorButton from '../CursorButton'
import Spotlight from './Spotlight'

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
                <Box width={'100%'} display={'flex'} flexDirection={'row'} position={'relative'} alignItems={'flex-end'} justifyContent={'space-between'} paddingX={16} paddingY={4}>
                    <Logo h={76} w={76} />
                    <Spotlight />
                </Box>
            </Flex>
            <CursorButton />
        </div>
    )
}
