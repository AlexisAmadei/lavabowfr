import React from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { Grid, GridItem } from '@chakra-ui/react'
import EventTicket from './EventTicket'

const events = [
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: ''
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: ''
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: ''
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: ''
    },
]

export default function NextEvents() {
    return (
        <Section id='events'>
            <LavaTypo variant={'h1'}>Retrouve nous en concert</LavaTypo>
            <Grid
                className='events-list'
                templateColumns={{ base: "repeat(1, 1fr)", xl: "repeat(2, 1fr)" }}
                gap="6"
            >
                {events.map((event, index) => (
                    <GridItem key={index} >
                        <EventTicket event={event} />
                    </GridItem>
                ))}
            </Grid>
        </Section>
    )
}
