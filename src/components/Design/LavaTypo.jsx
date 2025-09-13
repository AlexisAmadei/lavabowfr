import React from 'react'
import './styles/LavaTypo.css'

export default function LavaTypo({ variant, children, styles }) {
    switch (variant) {
        case 'h1':
            return <h1 className='lava-typo' style={styles}>{children}</h1>

        case 'h2':
            return <h2 className='lava-typo' style={styles}>{children}</h2>

        case 'h3':
            return <h3 className='lava-typo' style={styles}>{children}</h3>

        case 'accent':
            return <span className='lava-typo accent' style={styles}>{children}</span>

        case 'bold':
            return <span className='lava-typo bold' style={styles}>{children}</span>

        default:
            return <p className='lava-typo' style={styles}>{children}</p>;
    }
}
