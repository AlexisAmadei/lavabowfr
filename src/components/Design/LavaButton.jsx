import React from 'react'
import './styles/LavaButton.css'

export default function LavaButton({
    variant,
    children,
    onClick,
    startIcon,
    style,
    className,
    padding,
    ...props
}) {
    return (
        <button
            className={`lava-button ${variant} ${className || ''}`}
            onClick={onClick}
            style={{ padding, ...style }}
            {...props}
        >
            {startIcon && <span className="start-icon">{startIcon}</span>}
            {children}
        </button>
    )
}
