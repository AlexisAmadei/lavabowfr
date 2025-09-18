import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '../../Design/LavaTypo'
import './Pictures.css'

export default function PicFrame({ event }) {
    return (
        <Flex className='pic-frame'
            direction={'column'}
            padding={'20px'}
            alignItems={'center'}
            gap={'20px'}
            backgroundColor={'white'}
            justifyContent={'space-between'}
        >
            <img src={event.image} alt={event.title} />
            <LavaTypo variant='h3'>{event.title ?? "Titre de l'event"}</LavaTypo>
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
                    {event.date ?? "20/03/2025"}
                </LavaTypo>
            </Box>
        </Flex>
    )
}
