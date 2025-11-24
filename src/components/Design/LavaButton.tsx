import React from 'react'
import './styles/LavaButton.css'
import GlassSurface from '../react-bits/GlassSurface/GlassSurface';

interface LavaButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  padding?: string | number;
  glassSurface?: boolean
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
  color,
  size,
  disabled = false,
  type = 'button',
  glassSurface = false,
  ...props
}: LavaButtonProps & {
  fullWidth?: boolean;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <>
      {glassSurface ? (
        <GlassSurface height={'100%'} width={'100%'}>
          <button
            className={`lava-button ${className} ${color} ${size} ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            style={{ padding, ...style, width: fullWidth ? '100%' : 'auto', textAlign: 'center', textWrap: 'nowrap' }}
            {...props}
          >
            {startIcon && <span className="start-icon">{startIcon}</span>}
            {children}
          </button>
        </GlassSurface>
      ) : (
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
      )}
    </>
  )
}
