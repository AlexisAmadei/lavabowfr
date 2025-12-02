import { ReactNode, CSSProperties, HTMLAttributes } from 'react'
import './styles/LavaTypo.css'
import useIsMobile from '@/hooks/useIsMobile'

type TypoVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'accent' | 'bold' | 'p'
type TextAlign = 'left' | 'center' | 'right' | 'justify'

interface LavaTypoProps extends HTMLAttributes<HTMLElement> {
  /** The typography variant to render */
  variant?: TypoVariant
  /** The content to render */
  children: ReactNode
  /** Custom inline styles */
  styles?: CSSProperties
  /** Font size for the typography */
  size?: string | number
  /** Text alignment */
  textAlign?: TextAlign
}

const defaultProps: Partial<LavaTypoProps> = {
  variant: 'p',
  textAlign: 'left',
  size: undefined,
  styles: {},
}

export default function LavaTypo({
  variant = defaultProps.variant as TypoVariant,
  children,
  styles = defaultProps.styles as CSSProperties,
  size,
  textAlign = defaultProps.textAlign as TextAlign,
  color,
  style: userStyle,
  ...props
}: LavaTypoProps) {
  const isMobile = useIsMobile()

  const mergedStyles: CSSProperties = {
    fontSize: size,
    textAlign: variant === 'h1' && isMobile ? 'center' : textAlign,
    color: color,
    ...styles,
    ...userStyle,
  }

  switch (variant) {
    case 'h1':
      return (
        <h1 className="lava-typo" style={mergedStyles} {...props}>
          {children}
        </h1>
      )

    case 'h2':
      return (
        <h2 className="lava-typo" style={mergedStyles} {...props}>
          {children}
        </h2>
      )

    case 'h3':
      return (
        <h3 className="lava-typo" style={mergedStyles} {...props}>
          {children}
        </h3>
      )

    case 'h4':
      return (
        <h4 className="lava-typo" style={mergedStyles} {...props}>
          {children}
        </h4>
      )

    case 'accent':
      return (
        <span className="lava-typo accent" style={mergedStyles} {...props}>
          {children}
        </span>
      )

    case 'bold':
      return (
        <span className="lava-typo bold" style={mergedStyles} {...props}>
          {children}
        </span>
      )

    case 'p':
    default:
      return (
        <p className="lava-typo" style={mergedStyles} {...props}>
          {children}
        </p>
      )
  }
}
