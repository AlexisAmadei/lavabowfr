import useIsMobile from '@/hooks/useIsMobile';
import './styles/HeroTypo.css';
import Marquee from './Marquee';

export default function HeroTypo() {
  const isMobile = useIsMobile();

  return (
    <div className="hero-typo">
      <p>LAVA BOW</p>
      {isMobile ? (
        <Marquee text="LAVA BOW" speed={10} gap={8} />
      ) : (
        <p id="outline">LAVA BOW</p>
      )}
      <p>LAVA BOW</p>
    </div>
  );
}
