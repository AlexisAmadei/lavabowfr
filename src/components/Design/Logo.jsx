import React from 'react'
import logo from '../../assets/logo.svg'
import { Box } from '@chakra-ui/react'

export default function Logo({ h, w }) {
    return (
        <>
            <img src={logo} alt="Logo" height={h} width={w} />
        </>
    )
}
