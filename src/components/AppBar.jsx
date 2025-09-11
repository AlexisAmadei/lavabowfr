import React from 'react'
import LavaButton from './Design/LavaButton'
import './styles/AppBar.css'
import LavaTypo from './Design/LavaTypo'

export default function AppBar() {
    const menuItems = [
        { name: 'Accueil', link: '/' },
        { name: 'Music', link: '/music' },
        { name: 'Next events', link: '/events' },
    ]

    return (
        <div className='app-bar'>
            {menuItems.map(item => (
                <LavaButton key={item.name} variant={'outline'}>
                    <LavaTypo variant='text'>{item.name}</LavaTypo>
                </LavaButton>
            ))}
        </div>
    )
}