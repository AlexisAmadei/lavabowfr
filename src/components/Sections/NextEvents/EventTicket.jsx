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
import Stabilo from '@/assets/textures/stabilo.svg'

const TICKET_TEXT_SIZE = '18px';
const TICKET_TITLE_SIZE = '38px';
const TICKET_DESC_SIZE = '14px';

export default function EventTicket({ event }) {
  return (
    <Flex className='card-event'
      width={'756px'}
      height={'204px'}
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
          <Box position={'relative'} width={'fit-content'}>
            <Image
              src={Stabilo}
              alt=''
              position={'absolute'}
              width={'100%'}
              height={'50%'}
              top={'65%'}
              left={'0'}
              transform={'translateY(-50%)'}
              zIndex={50}
              pointerEvents={'none'}
              opacity={0.9}
            />
            <LavaTypo variant={'h2'} size={TICKET_TITLE_SIZE} styles={{ marginBottom: '8px', position: 'relative', zIndex: 1 }}>{event?.title.toUpperCase() || 'Event Title'}</LavaTypo>
          </Box>
          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} mt={'8px'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>PRIX</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>{event?.price === 0 ? 'PRIX LIBRE' : `${event?.price}€`}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>DATE</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>{event?.date ? new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Sam t'as oublié la date"}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>LIEU</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.5px'} dashArray={'2 1'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '400' }}>{event?.place || "Sam t'as oublié le lieu"}</LavaTypo>
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
            <Image src={Heads} alt='Event Heads' width={'auto'} height={'70px'} objectFit={'contain'} />
            <Logo h={70} w={70} />
          </Flex>
          <Box className='description'>
            <LavaTypo size={TICKET_DESC_SIZE}
              styles={{
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal',
                textAlign: 'left',
                marginLeft: '10px',
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
          zIndex={0}
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
