import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '../Design/LavaTypo'
import LavaInput from '../Design/LavaInput'
import lb_footer from '@/assets/footer/lb_footer.svg'
import useIsMobile from '@/hooks/useIsMobile'
import ClipboardElement from '../Core/ClipboardElement'

export default function Footer() {
  const isMobile = useIsMobile();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);

  return (
    <Flex
      paddingTop={isMobile ? 4 : 8}
      style={{
        backgroundColor: 'var(--main-accent)',
        width: '100%',
      }}
      direction={'column'}
      justifyContent={'space-between'}
      height={'auto'}
      gap={isMobile ? 8 : 16}
    >
      <Flex className='footer-infos' direction={isMobile ? 'column' : 'row'} width={'100%'} justifyContent={'space-evenly'} gap={isMobile ? 4 : 0}>
        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          gap={!isMobile ? 6 : 0}
          justifyContent={'center'}
          paddingX={4}
        >
          <LavaTypo variant={'h3'}>Booking</LavaTypo>
          <ClipboardElement text='lavabow.band@gmail.com' />
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          gap={!isMobile ? 6 : 0}
          alignItems={'flex-start'}
          paddingX={4}
          height={'68px'}
        >
          <LavaTypo variant={'h3'}>Réseaux</LavaTypo>
          <Flex flexDirection={'row'} gap={1} alignItems={'center'} zIndex={100}>
            <a href='https://www.instagram.com/lavabow/' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline' }}>Instagram</LavaTypo>
            </a>
            ,
            <a href='https://www.facebook.com/lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline' }}>Facebook</LavaTypo>
            </a>
            ,
            <a href='https://www.youtube.com/@lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo styles={{ textDecoration: 'underline' }}>YouTube</LavaTypo>
            </a>
          </Flex>
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          paddingX={4}
          m={0}
        >
          <LavaTypo variant={'h3'}>Newsletter</LavaTypo>
          <Box width={'100%'}>
            <LavaInput
              placeholder="Email"
              variant={'classic'}
              fontColor='black'
              fullWidth={true}
              error={error}
              setError={setError}
            />
          </Box>
        </Flex>
      </Flex>

      <Flex width={'100%'} flex={1} alignItems={'flex-end'} justifyContent={'center'}>
        <img src={lb_footer} alt='Logo Lavabow Footer' style={{ width: '100%', height: 'auto' }} />
      </Flex>
    </Flex>
  )
}
