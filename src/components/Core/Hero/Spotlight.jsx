import { Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'

export default function Spotlight() {
    return (
        <Flex direction={'column'} alignItems={'flex-end'}>

            <LavaTypo variant={'h2'}>"BigFish"</LavaTypo>
            <LavaTypo variant={'h3'} styles={{ marginBottom: '24px'}}>Notre dernier single disponible partout</LavaTypo>

            <Flex direction={'row'} gap={4} marginTop={4}>
                <LavaButton variant='filled'>
                    <LavaTypo variant='h3' styles={{ padding: '8px 16px' }}>Écouter</LavaTypo>
                </LavaButton>
                <LavaButton variant='outlined'>
                    <LavaTypo variant='h3' styles={{ padding: '8px 16px' }}>Acheter</LavaTypo>
                </LavaButton>
            </Flex>
        </Flex>
    )
}
