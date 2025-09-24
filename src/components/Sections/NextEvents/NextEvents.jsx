import React from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import EventTicket from './EventTicket'
import useIsMobile from '../../../hooks/useIsMobile'
import sample from '@/assets/img/events/events-1.webp'
import LavaButton from '@/components/Design/LavaButton'
import noEventBg from '@/assets/img/events/no-events.webp'

const events = [
  {
    title: 'Titre de l\'event',
    description: 'Description de l\'event',
    price: '6',
    date: '20/03/2025',
    location: 'Truskel',
    img: sample,
    link: ''
  },
  {
    title: 'Titre de l\'event',
    description: 'Description de l\'event',
    price: '6',
    date: '20/03/2025',
    location: 'Truskel',
    img: sample,
    link: ''
  },
  {
    title: 'Titre de l\'event',
    description: 'Description de l\'event',
    price: '6',
    date: '20/03/2025',
    location: 'Truskel',
    img: sample,
    link: ''
  },
  {
    title: 'Titre de l\'event',
    description: 'Description de l\'event',
    price: '6',
    date: '20/03/2025',
    location: 'Truskel',
    img: sample,
    link: ''
  },
]

const noEvent = events;

export default function NextEvents() {
  const isMobile = useIsMobile();

  if (noEvent.length === 0) {
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
        templateColumns={{ base: "repeat(1, 1fr)", xl: "repeat(2, 1fr)" }}
        gap="6"
        width={isMobile ? "100%" : "auto"}
      >
        {events.map((event, index) => (
          <GridItem key={index}>
            <EventTicket event={event} />
          </GridItem>
        ))}
      </Grid>
    </Section>
  )
}
