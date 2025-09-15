import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'

export default function Music() {
    return (
        <Section
            bgColor={'var(--secondary-accent)'}
            id='music'
        >
            <LavaTypo variant='h1'>Notre Musique</LavaTypo>
            <iframe data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/artist/54Y8JDIfmIb2zlHrB2ZoVF?utm_source=generator&theme=0"
            width="100%"
            height="352"
            loading="lazy"
            name='spotify-embed'
            ></iframe>
        </Section>
    )
}