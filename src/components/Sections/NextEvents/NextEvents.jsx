import React, { useEffect } from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import EventTicket from './EventTicket'
import useIsMobile from '../../../hooks/useIsMobile'
import LavaButton from '@/components/Design/LavaButton'
import noEventBg from '@/assets/img/events/no-events.webp'
import { fetchEventsContent } from '@/utils/supabase'

export default function NextEvents() {
  const isMobile = useIsMobile();
  const [events, setEvents] = React.useState([]);
  const [filteredEvents, setFilteredEvents] = React.useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await fetchEventsContent(setEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(events.filter(event => event.status !== 'INACTIVE'));
  }, [events]);

  if (filteredEvents.length === 0) {
    return (
      <Box
        id='events'
        className='lava-section'
        gap={'72px'}
        height='800px'
        backgroundImage={`url(${noEventBg})`}
        backgroundSize='cover'
        backgroundPosition={'center'}
        background={'radial-gradient(56.7% 49.96% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(' + noEventBg + ') lightgray 50% / cover no-repeat;'}
      >
        <LavaTypo variant={'h2'}>
          Comme toi, Côme attend patiemment le prochain évènement...
        </LavaTypo>
        <LavaButton variant={'outlined'} padding={'24px 48px'}>
          <LavaTypo variant={'text'} styles={{ fontWeight: 500 }}>En attendant suis nos aventures ici</LavaTypo>
        </LavaButton>
      </Box>
    )
  }
  return (
    <Section id='events'>
      <LavaTypo variant={'h1'}>Retrouve nous en concert</LavaTypo>
      <Grid
        className='events-list'
        templateColumns={{ base: "repeat(1, 1fr)" }}
        gap="6"
        width={isMobile ? "100%" : "auto"}
      >
        {filteredEvents.map((event, index) => (
          <GridItem key={index} colSpan={1}>
            <EventTicket event={event} />
          </GridItem>
        ))}
      </Grid>
    </Section>
  )
}
