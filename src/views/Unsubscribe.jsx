import Socials from '@/components/Core/AppBar/Socials'
import HeroTypo from '@/components/Design/HeroTypo'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { AbsoluteCenter, Box, Flex } from '@chakra-ui/react'
import React from 'react'

export default function Unsubscribe() {
  return (
    <AbsoluteCenter
      flexDirection={'column'}
      gap={6}
      width={'100%'} height={'100%'}
      backgroundColor={'var(--Background-bg-brand)'}
      overflow={'hidden'}
    >
      <Flex
        position={'absolute'} top={0}
        left={0}
        width={'100%'}
        height={'100%'}
        zIndex={-1}
        opacity={0.1}
        overflow={'hidden'}
        display={'flex'}
        flexDirection={'column'}
        direction={'column'}
        alignItems={'center'}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <HeroTypo key={index} fontSize={15} repeated={true} />
        ))}
      </Flex>
      <Logo h={70} w={70} />
      <Socials />
      <LavaTypo variant={'h1'} styles={{ marginBottom: 0 }}>Nonnnn ne nous quittes pas stp</LavaTypo>
      <LavaTypo variant={'h4'} styles={{ marginBottom: "40px" }}>Bon ok on te laisse partir mais on se revoit en concert 🫶🏻</LavaTypo>
      <LavaButton color='secondary' size='large'>Je me désinscris</LavaButton>
    </AbsoluteCenter>
  )
}
