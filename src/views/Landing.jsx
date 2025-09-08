import React from 'react'
import './styles/Landing.css'
import AppBar from '../components/AppBar'

import Cover from '../assets/cover.jpg'
import HeroTypo from '../components/Design/HeroTypo'

export default function Landing() {
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <div className='landing-hero'
                    style={{
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
                </div>
                <div className='landing-body' style={{ height: '200px' }}>
                    <h2>Body Section</h2>
                </div>
            </div>
        </div>
    )
}
