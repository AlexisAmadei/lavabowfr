import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Flex } from '@chakra-ui/react'
import CompactDisc from '../Core/CompactDisc/CompactDisc'

export default function Music() {
    return (
        <Section
            bgColor={'var(--secondary-accent)'}
            id='music'
        >
            <LavaTypo variant='h1'>Notre Musique</LavaTypo>
            <Flex
                width={'100%' }
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-around'}
                gap={10}
            >
                <CompactDisc />
                <iframe data-testid="embed-iframe"
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/artist/54Y8JDIfmIb2zlHrB2ZoVF?utm_source=generator&theme=0"
                    width="100%"
                    height="352"
                    loading="lazy"
                    name='spotify-embed'
                ></iframe>
            </Flex>
        </Section>
    )
}