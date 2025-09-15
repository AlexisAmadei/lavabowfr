import React from 'react'
import Section from '../Design/Section'
import LavaTypo from '../Design/LavaTypo'
import EventTicket from './EventTicket'
import { Grid, GridItem } from '@chakra-ui/react'

const events = [
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: 'http://www.google.com'
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: 'http://www.google.com'
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: 'http://www.google.com'
    },
    {
        title: 'Titre de l\'event',
        description: 'Description de l\'event',
        price: '6',
        date: '20/03/2025',
        location: 'Truskel',
        img: '',
        link: 'http://www.google.com'
    },
]

export default function NextEvents() {
    return (
        <Section>
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
