import React from 'react'
import './styles/LavaButton.css'

export default function LavaButton({ variant, children, onClick }) {
    return (
        <button className={`lava-button ${variant}`} onClick={onClick}>
            {children}
        </button>
    )
}
