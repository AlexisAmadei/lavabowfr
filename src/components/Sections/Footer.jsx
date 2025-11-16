import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '../Design/LavaTypo'
import LavaInput from '../Design/LavaInput'
import lb_footer from '@/assets/footer/lb_footer.svg'
import useIsMobile from '@/hooks/useIsMobile'

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <Flex
      style={{
        backgroundColor: 'var(--main-accent)',
        width: '100%',
        padding: '16px'
      }}
      direction={'column'}
      justifyContent={'space-between'}
      height={isMobile ? '350px' : '600px'}
    >
      <Flex className='footer-infos' direction={isMobile ? 'column' : 'row'} width={'100%'} justifyContent={'space-evenly'} gap={isMobile ? 4 : 0}>
        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          gap={!isMobile ? 6 : 0}
          height={'68px'}
        >
          <LavaTypo variant={'h3'}>Booking</LavaTypo>
          <a href='mailto:lavabow.band@gmail.com'>
            <LavaTypo>lavabow.band@gmail.com</LavaTypo>
          </a>
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          gap={!isMobile ? 6 : 0}
          alignItems={'flex-start'}
          height={'68px'}
        >
          <LavaTypo variant={'h3'}>Réseaux</LavaTypo>
          <Flex flexDirection={'row'} gap={'8px'}>
            <a href='https://www.instagram.com/lavabow/' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline'}}>Instagram</LavaTypo>
            </a>
            ,
            <a href='https://www.facebook.com/lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline'}}>Facebook</LavaTypo>
            </a>
            ,
            <a href='https://www.youtube.com/@lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline'}}>YouTube</LavaTypo>
            </a>
          </Flex>
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          // gap={2}
          alignItems={'flex-start'}
          p={0}
          m={0}
          height={'68px'}
          width={'100%'}
        >
          <LavaTypo variant={'h3'}>Newsletter</LavaTypo>
          <Box width={'100%'} borderBottom={'1px solid white'}>
            <LavaInput placeholder="Email" variant={'classic'} fullWidth={true} />
          </Box>
        </Flex>
      </Flex>
      <Flex width={'100%'} flex={1} alignItems={'flex-end'} justifyContent={'center'}>
        <img src={lb_footer} alt='Logo Lavabow Footer' style={{ width: '100%', height: 'auto' }} />
      </Flex>
    </Flex>
  )
}
