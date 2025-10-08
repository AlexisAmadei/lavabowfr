import { Box, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import LavaTypo from '../../Design/LavaTypo'
import './Pictures.css'
import { EVENT_DEFAULTS } from '@/constants/events'

export default function PicFrame({ event }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <Box className="card-container" onClick={handleCardClick}>
      <Box className={`card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front side */}
        <Flex className='pic-frame front'
          direction={'column'}
          padding={'20px'}
          alignItems={'center'}
          gap={'20px'}
          backgroundColor={'white'}
          justifyContent={'space-between'}
        >
          <img src={event.image} alt={event.title} />
          <LavaTypo variant='h3'>{event.title ?? EVENT_DEFAULTS.title}</LavaTypo>
          <Box
            color={'#ff2929e2'}
            position={'absolute'}
            width={'fit-content'}
            top={'-3px'}
            right={'50%'}
            transform={'translateX(50%)'}
          >
            <LavaTypo variant='body1'
              styles={{
                fontSize: '14px',
                fontWeight: '400'
              }}
            >
              {event.date ?? EVENT_DEFAULTS.date}
            </LavaTypo>
          </Box>
        </Flex>

        {/* Back side */}
        <Flex className='pic-frame back'
          direction={'column'}
          padding={'20px'}
          alignItems={'center'}
          gap={'20px'}
          backgroundColor={'white'}
          justifyContent={'center'}
          textAlign={'center'}
        >
          <LavaTypo variant='h3' styles={{ marginBottom: '10px' }}>
            {event.title ?? EVENT_DEFAULTS.title}
          </LavaTypo>
          <LavaTypo variant='body1' styles={{ fontSize: '16px', lineHeight: '1.4' }}>
            {event.description ?? EVENT_DEFAULTS.description}
          </LavaTypo>
          <Box mt={4}>
            <LavaTypo variant='body2' styles={{ fontSize: '14px', color: '#ff2929e2', fontWeight: 'bold' }}>
              Date: {event.date ?? EVENT_DEFAULTS.date}
            </LavaTypo>
            {event.location && (
              <LavaTypo variant='body2' styles={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Lieu: {event.location}
              </LavaTypo>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
