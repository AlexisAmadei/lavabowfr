import { Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from './Design/LavaTypo'
import './styles/Music.css'

export default function Music() {
    return (
        <Flex
            className='music-section'
            paddingY={'100px'}
            width={'100%'}
            direction={'column'}
            alignItems={'center'}
            textAlign={'center'}
            gap={8}
            paddingX={16}
            // maxWidth={1400}
        >
            <LavaTypo variant='h1'>Notre Musique</LavaTypo>
            <iframe data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/artist/54Y8JDIfmIb2zlHrB2ZoVF?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"></iframe>
        </Flex>
    )
}
