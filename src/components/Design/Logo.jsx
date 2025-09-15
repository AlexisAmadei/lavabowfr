import React from 'react'
import logo from '@/assets/icons/logo.svg'

export default function Logo({ h, w }) {
    return (
        <>
            <img src={logo} alt="Logo" height={h} width={w} />
        </>
    )
}
