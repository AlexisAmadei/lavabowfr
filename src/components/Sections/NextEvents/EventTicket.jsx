import React from 'react'
import './EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import Heads from '@/assets/img/events/heads.png'
import Barcode from 'react-barcode'
import TicketPlacement from './TicketPlacement'

export default function EventTicket({ event }) {
  return (
    <Flex className='card-event'
      width={'630px'}
      height={'170px'}
      backgroundColor={'var(--Background-bg-brand)'}
    >
      <Flex
        flexBasis={'1/2'}
        direction={'row'}
        height={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={1}
        py={1}
      >
        <Flex
          direction={'column'}
          width={'45px'}
          height={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          gap={2}
          p={1}
        >
          <TicketPlacement type="Num" number="1" />
          <Divider orientation='horizontal' color={'white'} dashed={true} thickness={'1px'} />

          <TicketPlacement type="Rang" number="15" />
          <Divider orientation='horizontal' color={'white'} dashed={true} thickness={'1px'} />

          <TicketPlacement type="Siège" number="20" />
        </Flex>
        <Divider orientation='vertical' color={'white'} />

        <Flex direction={'column'} height={'100%'} justifyContent={'space-around'} gap={1} paddingLeft={2} width={'100%'} pr={1}>
          <LavaTypo variant={'h2'} size={'24px'} styles={{ marginBottom: '8px' }}>{event?.title.toUpperCase() || 'Event Title'}</LavaTypo>
          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} mt={'8px'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>PRIX</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} />
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>{event?.price || '0'}€</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>DATE</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} />
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>{event?.date ? new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Sam t'as oublié la date"}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <LavaTypo variant={'h3'} size={'16px'} styles={{ fontWeight: '400' }}>LIEU</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} />
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
        py={1}
        position={'relative'}
        overflow={'hidden'}
      >
        <Flex
          direction={'column'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
          p={2}
          justifyContent={'space-between'}
          paddingRight={'40px'}
        >
          <div className='heads'>
            <img src={Heads} alt='Event Heads' />
          </div>
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

        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          width={'30px'}
          height={'100%'}
          position={'absolute'}
          right={'0'}
          top={'0'}
          backgroundColor={'white'}
        >
          <div style={{ transform: 'rotate(90deg)', width: 'fit-content' }}>
            <Barcode
              renderer='svg'
              value={event?.ticketCode || 'https://lavabow.fr'}
              width={1}
              height={30}
              displayValue={false}
              background='transparent'
            />
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}
