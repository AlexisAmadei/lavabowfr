import React from 'react'
import './styles/Section.css'
import LavaTypo from './LavaTypo'

export default function Section({ children, bgImage, bgColor, title }) {
    return (
        <div className='lava-section' style={{ backgroundImage: `url(${bgImage})`, backgroundColor: bgColor, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {title && <LavaTypo variant={'h2'}>{title}</LavaTypo>}
            {children}
        </div>
    )
}
