import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { AbsoluteCenter } from '@chakra-ui/react'
import './AppBar.css'
import { ArrowIcon } from '@/components/Design/Icons'

export default function AppBar() {
    const menuItems = [
        { name: 'About us', link: '#about', variant: 'outlined' },
        { name: 'Music', link: '#music', variant: 'outlined' },
        { name: 'Next events', link: '#events', variant: 'outlined' },
        { name: 'Videos', link: '#videos', variant: 'outlined' },
        { name: 'Photos', link: '#photos', variant: 'outlined' },
        { name: 'Contact', link: '#contact', variant: 'filled', endIcon: ArrowIcon },
    ]

    return (
        <AbsoluteCenter className='app-bar'
            axis={'horizontal'}
            direction={'row'}
            gap={4}
            mt={6}
        >
            {menuItems.map(item => (
                <LavaButton key={item.name} variant={item.variant} className="app-bar__button" onClick={() => {
                    const section = document.querySelector(item.link)
                    section.scrollIntoView({ behavior: 'smooth' })
                }}>
                    <LavaTypo variant='text'>{item.name}</LavaTypo>
                    {item.endIcon && (
                        <span className="app-bar__icon-on-hover">
                            <item.endIcon />
                        </span>
                    )}
                </LavaButton>
            ))}
        </AbsoluteCenter>
    )
}