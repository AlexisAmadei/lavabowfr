import React from 'react'
import './styles/EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Logo from '../Design/Logo'
import LavaButton from '../Design/LavaButton'
import Barcode from 'react-barcode'

const Divider = () => <div style={{ width: '1px', backgroundColor: '#00000052', height: '100%' }} />

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

            <Divider />

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

            <Divider />

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
                    <Box style={{ height: '33px', width: '194px' }} overflow={'hidden'} className='barcode-container'>
                        <Barcode value={'lavabow'} height={33} displayValue={false} margin={0} />
                    </Box>
                    <LavaButton variant={'filled'} style={{ width: '100%' }}>
                        Je prends ma place
                    </LavaButton>
                </Flex>
            </Flex>
        </Flex>
    )
}
