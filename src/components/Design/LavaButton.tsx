import React from 'react'
import './styles/LavaButton.css'

interface LavaButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  padding?: string | number;
  [key: string]: any; // For any additional props
}

export default function LavaButton({
  variant = 'filled',
  children,
  onClick,
  startIcon,
  style,
  className = '',
  padding,
  fullWidth = false,
  ...props
}: LavaButtonProps) {
  return (
    <button
      className={`lava-button ${variant} ${className}`}
      onClick={onClick}
      style={{ padding, ...style, width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {startIcon && <span className="start-icon">{startIcon}</span>}
      {children}
    </button>
  )
}
