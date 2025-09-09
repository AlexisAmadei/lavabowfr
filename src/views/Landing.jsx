import React from 'react'
import './styles/Landing.css'
import AppBar from '../components/AppBar'


import Hero from '../components/Hero'

export default function Landing() {
    return (
        <div className='app-wrapper'>
            <AppBar />
            <div className='landing-page'>
                <Hero />
                <div className='landing-body' style={{ height: '200px' }}>
                    <h2>Body Section</h2>
                </div>
            </div>
        </div>
    )
}
