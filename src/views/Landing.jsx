import React from 'react'
import './styles/Landing.css'
import AppBar from '../components/AppBar'

import Cover from '../assets/cover.jpg'
import HeroTypo from '../components/Design/HeroTypo'

export default function Landing() {
    return (
        <>
            <AppBar />
            <div className='landing-page'>
                <div
                    className="landing-background"
                    style={{
                        backgroundImage: `url(${Cover})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100vh",
                    }}
                >
                    <HeroTypo />
                </div>
            </div>
        </>
    )
}
