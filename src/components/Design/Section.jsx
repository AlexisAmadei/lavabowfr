import React from 'react'
import './styles/Section.css'

export default function Section({ children, bgImage, bgColor }) {
    return (
        <div className='lava-section' style={{ backgroundImage: `url(${bgImage})`, backgroundColor: bgColor, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {children}
        </div>
    )
}
