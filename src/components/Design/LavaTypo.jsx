import React from 'react'
import './styles/LavaTypo.css'

export default function LavaTypo({ variant, children }) {
    switch (variant) {
        case 'title':
            return <h1 className='lava-typo'>{children}</h1>

        case 'subtitle':
            return <h2 className='lava-typo'>{children}</h2>

        default:
            return <p className='lava-typo'>{children}</p>;
    }
}
