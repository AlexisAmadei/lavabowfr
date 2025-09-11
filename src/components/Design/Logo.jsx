import React from 'react'
import logo from '../../assets/logo.svg'
import { Box } from '@chakra-ui/react'

export default function Logo({ h, w }) {
    return (
        <Box position={'absolute'} bottom={6} left={6}>
            <img src={logo} alt="Logo" height={h} width={w} />
        </Box>
    )
}
