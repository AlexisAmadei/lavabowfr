import React, { useEffect, useState, forwardRef } from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { Box, Flex } from '@chakra-ui/react'
import EventTicket from './EventTicket'
import useIsMobile from '../../../hooks/useIsMobile'
import LavaButton from '@/components/Design/LavaButton'
import noEventBg from '@/assets/img/events/no-events.webp'
import { fetchEventsContent } from '@/utils/supabase/events'

// eslint-disable-next-line
import { AnimatePresence, motion, usePresenceData } from 'motion/react'

// Utility function to wrap around array indices
const wrap = (min, max, v) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

// Arrow components
const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

// Styles
const button = {
  border: 'none',
  borderRadius: '50%',
  width: '48px',
  height: '48px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}

export default function NextEvents() {
  const isMobile = useIsMobile();
  const [events, setEvents] = React.useState([]);
  const [filteredEvents, setFilteredEvents] = React.useState([]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [direction, setDirection] = useState(1)

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
    const filtered = events.filter(event => event.status !== 'INACTIVE');
    const sorted = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredEvents(sorted);
  }, [events]);

  if (filteredEvents.length === 0) {
    return (
      <Box
        id='events'
        className='lava-section'
        gap={'48px'}
        height={isMobile ? '300px' : '800px'}
        backgroundImage={`url(${noEventBg})`}
        backgroundSize='cover'
        backgroundPosition={'center'}
        background={'radial-gradient(56.7% 49.96% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(' + noEventBg + ') lightgray 50% / cover no-repeat;'}
      >
        <LavaTypo variant={'h2'} size={isMobile && '22px'}>
          Comme toi, Côme attend patiemment le prochain évènement...
        </LavaTypo>
        <LavaButton variant='outlined' onClick={() => window.open('https://www.instagram.com/lava_bow/', '_blank')}>
          <LavaTypo variant={'h4'} styles={{ padding: '12px 24px' }}>En attendant suis nos aventures ici</LavaTypo>
        </LavaButton>
      </Box>
    )
  }

  function setSlide(newDirection) {
    const nextIndex = wrap(0, filteredEvents.length, selectedItemIndex + newDirection)
    setSelectedItemIndex(nextIndex)
    setDirection(newDirection)
  }

  const EventSlide = forwardRef(function EventSlide({ event }, ref) {
    const direction = usePresenceData()
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: direction * 100 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.1,
            type: "spring",
            visualDuration: 0.3,
            bounce: 0.3,
          },
        }}
        exit={{ opacity: 0, x: direction * -100 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <EventTicket event={event} />
      </motion.div>
    )
  })

  if (isMobile) {
    return (
      <Section id='events'>
        <LavaTypo variant={'h1'} size={'22px'}>Retrouve nous en concert</LavaTypo>

        <Box width="100%" overflow="hidden" minHeight={'450px'}>
          <AnimatePresence
            custom={direction}
            initial={false}
            mode="popLayout"
          >
            <EventSlide
              key={filteredEvents[selectedItemIndex]?.id || selectedItemIndex}
              event={filteredEvents[selectedItemIndex]}
            />
          </AnimatePresence>
        </Box>

        <Flex
          alignItems="center"
          justifyContent="center"
          gap="16px"
          mt={6}
        >
          <motion.button
            initial={false}
            aria-label="Previous"
            style={{
              ...button,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => setSlide(-1)}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft />
          </motion.button>

          <Box textAlign="center">
            <LavaTypo variant={'text'} size={'14px'}>
              {selectedItemIndex + 1} / {filteredEvents.length}
            </LavaTypo>
          </Box>

          <motion.button
            initial={false}
            aria-label="Next"
            style={{
              ...button,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => setSlide(1)}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight />
          </motion.button>
        </Flex>
      </Section>
    )
  }

  return (
    <Section id='events' title={'Retrouve nous en concert'}>
      <Flex mb={4} flexWrap={'wrap'} width={'100%'} direction={'column'} justifyContent={'space-around'} alignItems={'center'} gap={30}>
        {filteredEvents.map((event, index) => (
          <EventTicket event={event} key={index} />
        ))}
      </Flex>
    </Section>
  )
}
