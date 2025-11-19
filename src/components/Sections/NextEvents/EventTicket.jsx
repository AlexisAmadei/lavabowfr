import React from 'react'
import './EventTicket.css'
import { Box, Flex, Image } from '@chakra-ui/react'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import Heads from '@/assets/img/events/heads.png'
import Barcode from 'react-barcode'
import TicketPlacement from './TicketPlacement'
import Logo from '@/components/Design/Logo'

export default function EventTicket({ event }) {
  return (
    <Flex className='card-event'
      width={'630px'}
      height={'170px'}
      backgroundColor={'var(--Background-bg-brand)'}
      style={{ transform: 'scale(1.2)' }}
    >
      <Flex
        flexBasis={'1/2'}
        direction={'row'}
        height={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={1}
        py={1}
        p={1}
      >
        <Flex
          direction={'column'}
          height={'100%'}
          alignItems={'center'}
          width={'40px'}
          gap={2}
          mx={3}
          margin={0}
          justify={'space-evenly'}
        >
          <TicketPlacement type="Num" number="1" />
          <Divider orientation='horizontal' color={'white'} thickness={'1px'} />

          <TicketPlacement type="Rang" number="15" />
          <Divider orientation='horizontal' color={'white'} thickness={'1px'} />

          <TicketPlacement type="Siège" number="20" />
        </Flex>
        <Divider orientation='vertical' color={'white'} />

        <Flex direction={'column'} height={'100%'} justifyContent={'space-around'} gap={1} paddingLeft={2} width={'100%'} pr={1}>
          <LavaTypo variant={'h2'} size={'24px'} styles={{ marginBottom: '8px' }}>{event?.title.toUpperCase() || 'Event Title'}</LavaTypo>
          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} mt={'8px'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>PRIX</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'} />
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>{event?.price || '0'}€</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>DATE</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'}  />
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>{event?.date ? new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Sam t'as oublié la date"}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>LIEU</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'}  />
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>{event?.place || "Sam t'as oublié le lieu"}</LavaTypo>
          </Flex>
        </Flex>

        <Divider orientation='vertical' color={'white'} />
      </Flex>

      <Flex
        flexBasis={'1/2'}
        direction={'row'}
        height={'100%'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-evenly'}
        gap={1}
        position={'relative'}
        overflow={'hidden'}
      >
        <Flex
          direction={'column'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
          py={3}
          justifyContent={'space-between'}
          paddingX={1}
        >
          <Flex className='heads' width={'100%'} justifyContent={'space-evenly'} alignItems={'center'}>
            <Image src={Heads} alt='Event Heads' width={'auto'} height={'55px'} objectFit={'contain'} />
            <Logo h={50} w={50} />
          </Flex>
          <Box className='description'>
            <LavaTypo size={'12px'}
              styles={{
                textAlign: 'center',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              {event.description || "Sam t'as encore oublié la description.. spammez le sam@lavabow.fr"}
            </LavaTypo>
          </Box>
          <LavaButton style={{ backgroundColor: 'var(--main-accent)' }} fullWidth={true}>Ma place</LavaButton>
        </Flex>

        <Box h={'100%'} marginRight={'40px'}>
          <Divider orientation={'vertical'} color={'#ffffffd8'} dashed={true} thickness={'1.5px'} dashArray={'8 8'} rounded={true} />
        </Box>

        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          width={'30px'}
          height={'100%'}
          position={'absolute'}
          right={'0'}
          top={'0'}
          backgroundColor={'white'}
          zIndex={-1}
        >
          <div style={{ transform: 'rotate(90deg)', width: 'fit-content' }}>
            <Barcode
              renderer='svg'
              value={event?.ticketCode || 'https://lavabow.fr'}
              width={1}
              height={30}
              displayValue={false}
              background='var(--Background-bg-brand)'
              lineColor='white'
            />
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}
