import IconBeer from '@/assets/icons/beer.svg'

export default function BeerGauge({ palier, progress }: { palier: any; progress: number }) {
  return (
    <div key={palier.id} style={{ position: 'relative', margin: '0 4px' }}>
      <img
        src={IconBeer}
        alt='Beer Icon'
        style={{
          opacity: 0.3,
          filter: 'grayscale(100%)',
        }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        clipPath: `inset(${100 - progress}% 0 0 0)`,
      }}>
        <img
          src={IconBeer}
          alt='Beer Icon Filled'
          style={{
            opacity: 1,
            filter: 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
