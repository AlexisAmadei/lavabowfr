import React from 'react'
import './styles/LavaButton.css'

export default function LavaButton({ variant, children, onClick, startIcon }) {
    return (
        <button className={`lava-button ${variant}`} onClick={onClick}>
            {startIcon && <span className="start-icon">{startIcon}</span>}
            {children}
        </button>
    )
}
