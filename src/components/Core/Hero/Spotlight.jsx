import React from 'react'
import { Flex } from '@chakra-ui/react'
import LavaTypo from '../../Design/LavaTypo'
import LavaButton from '../../Design/LavaButton'
import useIsMobile from '../../../hooks/useIsMobile'

export default function Spotlight() {
    const isMobile = useIsMobile();

    return (
        <Flex direction={'column'} alignItems={isMobile ? 'center' : 'flex-end'} width={isMobile ? '100%' : 'auto'}>

            <LavaTypo variant={'h2'} styles={{ marginBottom: isMobile ? '8px' : '' }}>“Big Fish”</LavaTypo>
            <LavaTypo variant={'text'} styles={{ marginBottom: !isMobile ? '24px' : '' }}>Notre dernier single disponible partout</LavaTypo>

            <Flex direction={'row'} gap={4} marginTop={4}>
                <LavaButton variant='filled' padding={'12px 40px'}>
                    <LavaTypo variant='text' size={'24px'}>Écouter</LavaTypo>
                </LavaButton>
                <LavaButton variant='outlined' padding={'12px 40px'}>
                    <LavaTypo variant='text' size={'24px'}>Acheter</LavaTypo>
                </LavaButton>
            </Flex>

        </Flex>
    )
}
