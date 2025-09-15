import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Cover from '@/assets/img/cover.webp'
import Logo from '@/components/Design/Logo'
import Spotlight from './Spotlight'
import CursorButton from '../CursorButton/CursorButton'
import HeroTypo from '@/components/Design/HeroTypo'

export default function Hero({ userOS }) {
    return (
        <div className='landing-hero'
            style={{
                position: 'relative',
                backgroundImage: `url(${Cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                paddingTop: userOS === 'MacOS' ? '44px' : '2px'
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
