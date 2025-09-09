import React from 'react'
import HeroTypo from './Design/HeroTypo'
import Cover from '../assets/cover.jpg'
import CursorButton from './CursorButton'

export default function Hero() {
    return (
        <div className='landing-hero'
            style={{
                position: 'relative', // Added for absolute positioning context
                backgroundImage: `url(${Cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
            }}
        >
            <div className='landing-hero-content'>
                <HeroTypo />
            </div>
            <CursorButton />
        </div>
    )
}
