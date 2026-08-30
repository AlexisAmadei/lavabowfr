import * as React from 'react'

// next/image outside a Next runtime: the real module's default export comes
// back as an object (React rejects it as an element type) and its optimizer
// rejects data: URLs, which is what the bundled SVG imports become. A design
// canvas has no image optimizer, so this renders the plain <img> that
// next/image would have produced and drops the Next-only props.
type StaticImageData = { src: string; height?: number; width?: number }

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'height' | 'width' | 'placeholder'> {
  src: string | StaticImageData
  alt?: string
  height?: number | string
  width?: number | string
  fill?: boolean
  priority?: boolean
  quality?: number
  placeholder?: string
  blurDataURL?: string
  loader?: unknown
  unoptimized?: boolean
  overrideSrc?: string
  onLoadingComplete?: unknown
}

const NextImage = React.forwardRef<HTMLImageElement, ImageProps>(function NextImage(
  {
    src, alt = '', style, fill,
    // Next-only props: consumed here so they never reach the DOM.
    priority, quality, placeholder, blurDataURL, loader, unoptimized, overrideSrc, onLoadingComplete,
    ...rest
  },
  ref,
) {
  const resolved = typeof src === 'string' ? src : src?.src
  const fillStyle: React.CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : undefined
  return <img ref={ref} src={resolved} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />
})

export default NextImage
export { NextImage as Image }
export function getImageProps(props: ImageProps) {
  const { src, ...rest } = props
  return { props: { ...rest, src: typeof src === 'string' ? src : src?.src } }
}
