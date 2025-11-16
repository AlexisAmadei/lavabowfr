import React, { useMemo } from 'react'
import { Flex } from '@chakra-ui/react'
import { LuInstagram } from 'react-icons/lu';
import { FaMusic, FaSpotify } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';

export default function Socials() {
  const socials_icons = useMemo(() => [
    { name: 'Instagram', url: 'https://www.instagram.com/lava_bow/', icon: LuInstagram },
    { name: 'Facebook', url: 'https://www.facebook.com/lavabow', icon: FaFacebook },
    { name: 'Spotify', url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: FaMusic },
  ], []);
  return (
    <Flex
      direction={'row'}
      gap={3}
      alignItems={'center'}
    >
      {socials_icons.map((social) => (
        <div key={social.name}
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '50%',
          }}
        >
          <a href={social.url} target='_blank' rel='noreferrer'>
            <social.icon size={24} color='var(--Background-bg-brand)' />
          </a>
        </div>
      ))}
    </Flex>
  )
}
