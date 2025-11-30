import React from 'react'
import './styles/LavaButton.css'
import GlassSurface from '../react-bits/GlassSurface/GlassSurface';

interface LavaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text'
  children: React.ReactNode
  startIcon?: React.ReactNode
  padding?: string | number
  glassSurface?: boolean
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
        // @ts-expect-error Allow passing string dimensions to GlassSurface
        <GlassSurface height={""} width={fullWidth ? '100%' : 'fit-content'}>
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
