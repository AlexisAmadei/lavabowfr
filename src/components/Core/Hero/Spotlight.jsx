import { Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import useIsMobile from '../../../hooks/useIsMobile'

export default function Spotlight() {
    const isMobile = useIsMobile();

    return (
        <Flex direction={'column'} alignItems={isMobile ? 'center' : 'flex-end'} width={isMobile ? '100%' : 'auto'}>

            <LavaTypo variant={'h2'} styles={{ marginBottom: isMobile ? '8px' : '' }}>“Big Fish”</LavaTypo>
            <LavaTypo variant={'h3'} styles={{ marginBottom: !isMobile ? '24px' : '' }}>Notre dernier single disponible partout</LavaTypo>

            <Flex direction={'row'} gap={4} marginTop={4}>
                <LavaButton variant='filled'>
                    <LavaTypo variant='h3'>Écouter</LavaTypo>
                </LavaButton>
                <LavaButton variant='outlined'>
                    <LavaTypo variant='h3'>Acheter</LavaTypo>
                </LavaButton>
            </Flex>

        </Flex>
    )
}
