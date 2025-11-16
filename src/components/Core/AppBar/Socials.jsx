import React from 'react'
import { Flex } from '@chakra-ui/react'
import { socialLinks } from '@/lib/socialLinks';

export default function Socials() {
  return (
    <Flex
      direction={'row'}
      gap={3}
      alignItems={'center'}
    >
      {socialLinks.map((social) => (
        <div key={social.name}
          style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          onClick={() => window.open(social.url, '_blank')}
        >
          <a>
            <social.icon size={20} color='var(--Background-bg-brand)' />
          </a>
        </div>
      ))}
    </Flex>
  )
}
