'use client';

import LavaButton from '@/components/Design/LavaButton'
import { Flex } from '@chakra-ui/react'
import MediaLinks from './MediaLinks'
import Logo from '@/components/Design/Logo'
import Link from 'next/link'

export default function CompactAppBar() {
  return (
    <Flex className='app-bar'
      as={'nav'}
      direction={'row'}
      mt={6}
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={4}
      p={4}
    >
      <MediaLinks size='lg' padding='8px' />
      <Flex gap={3} alignItems='center'>
        <LavaButton
          variant='outlined'
        >
          <Link href='/'>Accueil</Link>
        </LavaButton>
        <LavaButton
          variant='outlined'
        >
          <Link href='/'>Contact</Link>
        </LavaButton>

        <Logo h='50px' w='50px' />
      </Flex>
    </Flex>
  )
}
