import { Box, Flex } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { LuInstagram } from 'react-icons/lu';
import { FaSpotify } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';

export default function Socials() {
  const socials_icons = useMemo(() => [
    { name: 'Instagram', url: 'https://www.instagram.com/lava_bow/', icon: LuInstagram },
    { name: 'Facebook', url: 'https://www.facebook.com/lavabow', icon: FaFacebook },
    { name: 'Spotify', url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: FaSpotify },
  ], []);
  return (
    <Flex
      direction={'row'}
      gap={3}
      alignItems={'center'}
    >
      {socials_icons.map((social) => (
        <div key={social.name}>
          <a href={social.url} target='_blank' rel='noreferrer'>
            <social.icon size={40} color='white' />
          </a>
        </div>
      ))}
    </Flex>
  )
}
