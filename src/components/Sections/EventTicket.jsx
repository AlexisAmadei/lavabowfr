import React from 'react'
import './styles/EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Logo from '../Design/Logo'
import LavaButton from '../Design/LavaButton'

export default function EventTicket({ event }) {
    return (
        <Flex
            direction={'row'}
            padding={'12px'}
            backgroundColor={'white'}
            className='event-ticket'
            gap={'10px'}
            h={'100%'}
        >
            <Flex direction={'column'} gap={'6px'} alignItems={'flex-start'} className='title-img'>
                <span className='event-title'>{event.title}</span>
                <div style={{ height:'115px', width: '198px', backgroundColor:'gray'}}></div>
            </Flex>

            <div className='vertical-divider' style={{ width: '1px', backgroundColor: '#000000ff', height: '100%' }}></div>

            <Flex className='event-infos'
                direction={'column'}
                justifyContent={'space-between'}
            >
                <p className='event-description'>{event.description}</p>
                <Box width={'100%'}>
                    <Flex className='event-details'
                        direction={'row'}
                        justifyContent={'space-between'}
                        pb={1}
                    >
                        <p>PRIX</p>
                        <div style={{ flex: 1, borderBottom: '1px solid black' }}></div>
                        <p>{event.price}€</p>
                    </Flex>
                    <Flex className='event-details'
                        direction={'row'}
                        justifyContent={'space-between'}
                        pb={1}
                    >
                        <p>DATE</p>
                        <div style={{ flex: 1, borderBottom: '1px solid black' }}></div>
                        <p>{event.date}</p>
                    </Flex>
                    <Flex className='event-details'
                        direction={'row'}
                        justifyContent={'space-between'}
                    >
                        <p>LIEU</p>
                        <div style={{ flex: 1, borderBottom: '1px solid black' }}></div>
                        <p>{event.location}</p>
                    </Flex>
                </Box>
            </Flex>

            <div className='vertical-divider' style={{ width: '1px', backgroundColor: '#000000ff', height: '100%' }}></div>

            <Flex className='event-action'
                direction={'column'}
                justifyContent={'space-between'}
                alignItems={'center'}
                h={'100%'}
            >
                <div style={{ alignSelf: 'flex-end' }}>
                    <Logo h={'35px'} w={'35px'} />
                </div>

                <Flex direction={'column'} alignItems={'center'} gap={3}>
                    <div style={{ height: '33px', width: '194px', backgroundColor: 'lightgray'}}>
                        {/* BARCODE */}
                    </div>
                    <LavaButton variant={'filled'} style={{ width: '100%' }}>
                        Je prends ma place
                    </LavaButton>
                </Flex>
            </Flex>
        </Flex>
    )
}
