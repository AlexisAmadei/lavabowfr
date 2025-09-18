import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Cover from '@/assets/img/cover.webp'
import CoverMobile from '@/assets/img/cover-mobile.webp'
import Logo from '@/components/Design/Logo'
import Spotlight from './Spotlight'
import CursorButton from '../CursorButton/CursorButton'
import HeroTypo from '@/components/Design/HeroTypo'
import useIsMobile from '../../../hooks/useIsMobile'

export default function Hero({ userOS }) {
    const isMobile = useIsMobile();

    return (
        <div className='landing-hero'
            style={{
                position: 'relative',
                backgroundImage: !isMobile ? `url(${Cover})` : `url(${CoverMobile})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                paddingTop: userOS === 'MacOS' ? '44px' : '2px'
            }}
        >
            <Flex direction='column' width='100%' height='100%' justifyContent={'space-between'} className='landing-hero-content'>
                <HeroTypo />
                <Box
                    className='hero-bottom'
                    width={'100%'}
                    display={'flex'}
                    flexDirection={'row'}
                    position={'relative'}
                    alignItems={'flex-end'}
                    justifyContent={'space-between'}
                    paddingX={!isMobile ? 16 : 4}
                    paddingY={4}
                    mb={4}
                >
                    {!isMobile &&
                        <Logo h={76} w={76} />
                    }
                    <Spotlight />
                </Box>
            </Flex>
            {!isMobile && (
                <CursorButton />
            )}
        </div>
    )
}
