import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import './styles/Music.css'
import { Flex } from '@chakra-ui/react'
import CompactDisk from '../Core/CompactDisk/CompactDisk'
import { motion } from 'framer-motion'

export default function Music() {
  return (
    <Section
      bgColor={'var(--secondary-accent)'}
      id='music'
    >
      <LavaTypo variant='h1'>Notre Musique</LavaTypo>
      <Flex
        width={'100%'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-around'}
        gap={10}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
        >
          <CompactDisk />
        </motion.div>
        <iframe data-testid="embed-iframe"
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/artist/54Y8JDIfmIb2zlHrB2ZoVF?utm_source=generator&theme=0"
          width="100%"
          height="352"
          loading="lazy"
          name='spotify-embed'
          allow="encrypted-media"
        ></iframe>
      </Flex>
    </Section>
  )
}