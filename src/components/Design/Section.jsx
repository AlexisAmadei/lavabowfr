import React from 'react'
import './styles/Section.css'
import { Flex } from '@chakra-ui/react'
import LavaTypo from './LavaTypo'

export default function Section({ children, bgImage, bgColor, id, contained, title, position = 'unset'}) {
  return (
    <div className='lava-section' id={id}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: bgColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: contained ? '1700px' : '100%',
        width: '100%',
        position: position
      }}
    >
      {title && (
        <Flex gap={3} direction={'column'} alignItems={'center'} marginBottom={'48px'}>
          <LavaTypo variant={'h1'} textAlign='center'>{title}</LavaTypo>
        </Flex>
      )}
      {children}
    </div>
  )
}
