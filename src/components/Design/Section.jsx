import React from 'react'
import './styles/Section.css'

export default function Section({ children, bgImage, bgColor, id, contained }) {
    return (
        <div className='lava-section' id={id}
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundColor: bgColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                maxWidth: contained ? '1700px' : '100%',
            }}
        >
            {children}
        </div>
    )
}
