import React from 'react'
import './styles/Section.css'
import LavaTypo from './LavaTypo'

export default function Section({ children, bgImage, bgColor, id }) {
    return (
        <div className='lava-section' id={id}
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundColor: bgColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {children}
        </div>
    )
}
