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
  [key: string]: any;
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
  color = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  ...props
}: LavaButtonProps & {
  fullWidth?: boolean;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      className={`lava-button ${variant} ${className} ${color} ${size} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={{ padding, ...style, width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {startIcon && <span className="start-icon">{startIcon}</span>}
      {children}
    </button>
  )
}
