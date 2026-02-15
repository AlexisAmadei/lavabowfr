import './EventTicket.css'
import { Box, Flex, Image } from '@chakra-ui/react'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import Heads from '@/assets/img/events/heads.webp'
import Barcode from 'react-barcode'
import Logo from '@/components/Design/Logo'
import Stabilo from '@/assets/textures/stabilo.svg'
import useIsMobile from '@/hooks/useIsMobile'
import type { EventItem } from '@/types/types'
import { useEffect, useState } from 'react'
import { insertAuditLog } from '@/utils/supabase/audit_log'

export default function EventTicket({ event }: { event: EventItem | null }) {
  const isMobile = useIsMobile();
  const [eventPayable, setEventPayable] = useState<boolean>(false);

  const TICKET_TITLE_SIZE = isMobile ? '30px' : '38px';
  const TICKET_TEXT_SIZE = '18px';
  const TICKET_DESC_SIZE = isMobile ? '12px' : '14px';

  useEffect(() => {
    if (event) {
      setEventPayable(event.price > 0 && !!event.link);
    }
  }, [event]);

  const handleEventClick = () => {
    if (event?.link) {
      insertAuditLog({
        event_type: 'event_ticket_click',
        data: { event_id: event.id, event_title: event.title },
      });

      // Small delay to ensure beacon is sent, or open immediately if faster
      const openWindow = () => window.open(event.link, '_blank');

      // Use requestIdleCallback for non-blocking timing
      if ('requestIdleCallback' in window) {
        requestIdleCallback(openWindow, { timeout: 100 });
      } else {
        setTimeout(openWindow, 10);
      }
    }
  }

  return (
    <Flex className='card-event'
      width={isMobile ? '300px' : '756px'}
      height={isMobile ? 'auto' : '204px'}
      backgroundColor={'var(--Background-bg-brand)'}
      direction={isMobile ? 'column' : 'row'}
    >
      <Flex
        flexBasis={'1/2'}
        direction={isMobile ? 'column' : 'row'}
        height={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={1}
        py={1}
        p={1}
      >
        <Flex direction={'column'} height={'100%'} justifyContent={'space-around'} gap={1} paddingLeft={isMobile ? 0 : 2} width={'100%'} pr={isMobile ? 0 : 1}>
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
              opacity={0.8}
              title='highlight'
              aria-hidden={true}
            />
            <LavaTypo variant={'h2'} size={TICKET_TITLE_SIZE} styles={{ marginBottom: '8px', position: 'relative', zIndex: 1 }}>{event?.title.toUpperCase() || 'Event Title'}</LavaTypo>
          </Box>

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} mt={'8px'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>PRIX</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.6px'} dashArray={'2 2'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>{event?.price === 0 ? 'PRIX LIBRE' : `${event?.price}€`}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>DATE</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.6px'} dashArray={'2 2'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>{event?.date ? new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Sam t'as oublié la date"}</LavaTypo>
          </Flex>

          <Divider orientation='horizontal' color={'white'} />

          <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} gap={1} textWrap={'nowrap'}>
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>LIEU</LavaTypo>
            <Divider orientation={'horizontal'} color={'#ffffffd8'} dashed={true} thickness={'0.6px'} dashArray={'2 2'} />
            <LavaTypo variant={'h3'} size={TICKET_TEXT_SIZE} styles={{ fontWeight: '800' }}>{event?.place || "Sam t'as oublié le lieu"}</LavaTypo>
          </Flex>
        </Flex>

        <Divider orientation='vertical' color={'white'} />
      </Flex>

      <Flex id='right-part'
        flexBasis={'1/2'}
        direction={isMobile ? 'column' : 'row'}
        height={'100%'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-evenly'}
        gap={1}
        position={'relative'}
        overflow={'hidden'}
      >
        <Flex id='main-ticket-content'
          direction={'column'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
          py={3}
          justifyContent={eventPayable ? 'space-between' : 'center'}
          paddingX={1}
          gap={eventPayable ? 0 : 8}
        >
          <Flex className='heads' width={'100%'} justifyContent={'space-evenly'} alignItems={'center'}>
            <Image src={Heads} alt='Event Heads' width={'auto'} height={'70px'} objectFit={'contain'} title='Event Heads' />
            <Logo h={'70'} w={'70'} />
          </Flex>
          <Box className='description' my={isMobile ? 3 : 0} px={isMobile ? 2 : 0}>
            <LavaTypo size={TICKET_DESC_SIZE}
              styles={{
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal',
                marginLeft: '10px',
              }}
              textAlign={isMobile ? 'center' : 'left'}
            >
              {event?.description || "Sam t'as encore oublié la description.. spammez le sam@lavabow.fr"}
            </LavaTypo>
          </Box>
          {eventPayable && (
            <LavaButton style={{ backgroundColor: 'var(--main-accent)' }} fullWidth={true} onClick={handleEventClick}>Ma place</LavaButton>
          )}
        </Flex>

        <Box h={'100%'} marginRight={!isMobile ? '40px' : undefined} id='divider'>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} color={'#ffffffd8'} dashed={true} thickness={'2px'} dashArray={'8 8'} rounded={true} />
        </Box>

        <Flex id='barcode'
          alignItems={'center'}
          justifyContent={'center'}
          width={'30px'}
          height={'100%'}
          position={isMobile ? undefined : 'absolute'}
          right={'0'}
          top={'0'}
          m={0}
          // backgroundColor={isMobile ? 'transparent' : 'var(--Background-bg-brand)'}
          zIndex={0}
        >
          <div style={{ transform: isMobile ? undefined : 'rotate(90deg)', width: 'fit-content' }}>
            <Barcode
              renderer='svg'
              value={'https://lavabow.fr'}
              width={!isMobile ? 1 : 4}
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
