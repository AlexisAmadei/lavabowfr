import React from 'react'
import './styles/LavaButton.css'

export default function LavaButton({ variant, children, onClick, startIcon, style, className, ...props }) {
    return (
        <button
            className={`lava-button ${variant} ${className || ''}`}
            onClick={onClick}
            style={style}
            {...props}
        >
            {startIcon && <span className="start-icon">{startIcon}</span>}
            {children}
        </button>
    )
}
