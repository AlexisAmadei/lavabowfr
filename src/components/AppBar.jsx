import React from 'react'
import LavaButton from './Design/LavaButton'
import LavaTypo from './Design/LavaTypo'
import { HiArrowLongRight } from 'react-icons/hi2'
import { AbsoluteCenter } from '@chakra-ui/react'
import './styles/AppBar.css'

export default function AppBar() {
    const menuItems = [
        { name: 'About us', link: '/', variant: 'outlined' },
        { name: 'Music', link: '/music', variant: 'outlined' },
        { name: 'Next events', link: '/events', variant: 'outlined' },
        { name: 'Videos', link: '/videos', variant: 'outlined' },
        { name: 'Photos', link: '/photos', variant: 'outlined' },
        { name: 'Contact', link: '/contact', variant: 'filled', endIcon: HiArrowLongRight },
    ]

    return (
        <AbsoluteCenter className='app-bar'
            axis={'horizontal'}
            direction={'row'}
            gap={4}
            mt={4}
        >
            {menuItems.map(item => (
                <LavaButton key={item.name} variant={item.variant} className="app-bar__button">
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