import { Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from './Design/LavaTypo'
import LavaInput from './Design/LavaInput'
import bgPic from '@/assets/newsletter.webp'
import Section from './Design/Section'

export default function Newsletter() {
    return (
        <Section bgImage={bgPic}>
            <Flex gap={8} direction={'column'} alignItems={'center'}>

                <Flex gap={3} direction={'column'} alignItems={'center'}>
                    <LavaTypo variant={'h2'}>Newsletter</LavaTypo>
                    <LavaTypo variant={'text'}>Deviens un LAVA FAN et ne rate plus aucune actualité !</LavaTypo>
                </Flex>

                <LavaInput
                    type='email'
                    placeholder='Ton email'
                />
            </Flex>
        </Section>
    )
}
