import React from 'react'
import { Flex } from '@chakra-ui/react'
import { socialLinks } from '@/lib/socialLinks'

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
            borderRadius: '50px',
            cursor: 'pointer',
            color: 'var(--Background-bg-brand)',
            height: '41px',
            width: '41px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => window.open(social.url, '_blank')}
        >
          <social.icon size={20} />
        </div>
      ))}
    </Flex>
  )
}
