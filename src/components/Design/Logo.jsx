import React from 'react'
import logo from '@/assets/icons/logo.svg'

export default function Logo({ h, w }) {
    return (
        <>
            <img className='lvb-logo' src={logo} alt="Logo" height={h} width={w} />
        </>
    )
}
