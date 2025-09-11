import { Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from './Design/LavaTypo'
import LavaInput from './Design/LavaInput'

export default function Newsletter() {
    return (
        <Flex direction={'column'} alignItems={'center'} gap={'6'}>
            <LavaTypo variant={'subtitle'}>Newsletter</LavaTypo>
            <LavaTypo variant={'text'}>Deviens un LAVA FAN et ne rate plus aucune actualité !</LavaTypo>
            <LavaInput />
        </Flex>
    )
}
