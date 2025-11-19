import useIsMobile from '@/hooks/useIsMobile';
import './styles/HeroTypo.css';
import Marquee from './Marquee';

export default function HeroTypo({ fontSize = 16, repeated = false }) {
  const isMobile = useIsMobile();

  return (
    <div className="hero-typo">
      <p style={{ fontSize: `${fontSize}vw` }}>LAVA BOW</p>
      {isMobile && !repeated ? (
        <Marquee text="LAVA BOW" speed={10} gap={8} />
      ) : (
        <p id="outline" style={{ fontSize: `${fontSize}vw` }}>LAVA BOW</p>
      )}
      {!repeated && (
        <p style={{ fontSize: `${fontSize}vw` }}>LAVA BOW</p>
      )}
    </div>
  );
}
