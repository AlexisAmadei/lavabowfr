import React from 'react'
import './EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import Heads from '@/assets/img/events/heads.png'
import Barcode from 'react-barcode'

export default function EventTicket({ event }) {
  return (
    <Flex className='card-event'
      width={'620px'}
      height={'165px'}
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
          width={'40px'}
          height={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          gap={2}
          p={1}
        >
          <LavaTypo variant={'h3'} size={'30px'} style={{ transform: 'rotate(90deg)' }}>1</LavaTypo>
          <Divider orientation='horizontal' color={'white'} dashed={true} thickness={'1px'} />
          <LavaTypo variant={'h3'} size={'30px'} style={{ transform: 'rotate(90deg)' }}>2</LavaTypo>
          <Divider orientation='horizontal' color={'white'} dashed={true} thickness={'1px'} />
          <LavaTypo variant={'h3'} size={'30px'} style={{ transform: 'rotate(90deg)' }}>15</LavaTypo>
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
        justifyContent={'space-between'}
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
              {event.description || "Sam t'as oublié la description"}
            </LavaTypo>
          </Box>
          <LavaButton style={{ backgroundColor: 'var(--main-accent)' }} fullWidth={true}>Ma place</LavaButton>
        </Flex>

        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          style={{ transform: 'rotate(90deg)', transformOrigin: ' center' }}
          width={'fit-content'}
        >
          <Barcode
            renderer='svg'
            value={event?.ticketCode || 'https://lavabow.fr'}
            width={1}
            height={30}
            displayValue={false}
            background='transparent'
            lineColor='#ffffffff'
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
