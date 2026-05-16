'use client';

import MediaLinks from "@/components/Core/AppBar/MediaLinks";
import HeroTypo from "@/components/Design/HeroTypo";
import LavaButton from "@/components/Design/LavaButton";
import LavaTypo from "@/components/Design/LavaTypo";
import Logo from "@/components/Design/Logo";
import { AbsoluteCenter, Box, Flex, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LookingAround from '@/assets/gif/john-tr.gif';

export default function NotFound() {
  const router = useRouter();

  return (
    <AbsoluteCenter
      flexDirection={'column'}
      gap={6}
      width={'100%'} height={'100%'}
      backgroundColor={'var(--Background-bg-brand)'}
      overflow={'hidden'}
      textAlign={'center'}
    >
      <Flex
        position={'absolute'} top={0}
        left={0}
        width={'100%'}
        height={'100%'}
        zIndex={-1}
        opacity={0.2}
        overflow={'hidden'}
        display={'flex'}
        flexDirection={'column'}
        direction={'column'}
        alignItems={'center'}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <HeroTypo key={index} repeated={true} />
        ))}
      </Flex>


      <Box
        position={'absolute'}
        top={'50%'}
        transform={'translateY(-50%)'}
        zIndex={-1}
      >
        <Image alt="travolta-looking-around" src={LookingAround} aspectRatio={'1/1'} height={450} />
      </Box>
      <Link href="/">
        <Box transition="transform 1s ease" _hover={{ transform: 'rotate(1080deg)' }} transformOrigin="center" display="inline-block" cursor="pointer">
          <Logo h={'70'} w={'70'} />
        </Box>
      </Link>

      <MediaLinks />
      <LavaTypo variant={'h1'} textAlign="center" styles={{ marginBottom: 0 }}>Tu t’es perdu ??</LavaTypo>
      <LavaTypo variant={'p'} textAlign="center" styles={{ marginBottom: "40px" }}>On est pas bien méchant donc rejoins-nous en cliquant en dessous. Allez viens on est bien...</LavaTypo>

      <Box>
        <LavaButton color='secondary' size='large' onClick={() => router.push('/')}>Accueil</LavaButton>
      </Box>
    </AbsoluteCenter>
  )
}
