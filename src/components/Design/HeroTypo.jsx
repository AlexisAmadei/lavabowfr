import useIsMobile from '@/hooks/useIsMobile';
import './styles/HeroTypo.css';
import Marquee from './Marquee';

export default function HeroTypo() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="hero-typo">
        <p>LAVA BOW</p>
        {/* <p id="outline">LAVA BOW</p> */}
        <Marquee text="LAVA BOW" speed={10} gap={8} />
        <p>LAVA BOW</p>
      </div>
    );
  }
  return (
    <div className="hero-typo">
      <p>LAVA BOW</p>
      <p id="outline">LAVA BOW</p>
      <p>LAVA BOW</p>
    </div>
  );
}
