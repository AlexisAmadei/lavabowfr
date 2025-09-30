import React from 'react'
import './styles/LavaTypo.css'

export default function LavaTypo({ variant, children, styles, size, ...props }) {
  switch (variant) {
    case 'h1':
      return <h1 className='lava-typo' style={{ fontSize: size, ...styles }} {...props}>{children}</h1>

    case 'h2':
      return <h2 className='lava-typo' style={{ fontSize: size, ...styles }} {...props}>{children}</h2>

    case 'h3':
      return <h3 className='lava-typo' style={{ fontSize: size, ...styles }} {...props}>{children}</h3>

    case 'accent':
      return <span className='lava-typo accent' style={{ fontSize: size, ...styles }} {...props}>{children}</span>

    case 'bold':
      return <span className='lava-typo bold' style={{ fontSize: size, ...styles }} {...props}>{children}</span>

    default:
      return <p className='lava-typo' style={{ fontSize: size, ...styles }} {...props}>{children}</p>;
  }
}
