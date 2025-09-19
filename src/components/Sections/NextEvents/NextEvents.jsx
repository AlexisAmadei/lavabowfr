import React from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { Grid, GridItem } from '@chakra-ui/react'
import EventTicket from './EventTicket'
import useIsMobile from '../../../hooks/useIsMobile'
import sample from '@/assets/img/events/events-1.webp'

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

export default function NextEvents() {
    const isMobile = useIsMobile();

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
                    <GridItem key={index} >
                        <EventTicket event={event} />
                    </GridItem>
                ))}
            </Grid>
        </Section>
    )
}
