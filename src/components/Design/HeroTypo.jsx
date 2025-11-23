import useIsMobile from '@/hooks/useIsMobile';
import './styles/HeroTypo.css';
import Marquee from './Marquee';
import { Box } from '@chakra-ui/react';

import HeroFilled from '@/assets/img/HeroTypo/hero-filled.svg';
import HeroOutlined from '@/assets/img/HeroTypo/hero-outlined.svg';

export default function HeroTypo({ fontSize = 15, repeated = false }) {
  const isMobile = useIsMobile();
  const smallHeight = window.innerHeight < 800;

  return (
    <Box className='hero-typo' width={'100%'}>
      <img src={HeroFilled} width={'100%'} height={'auto'} alt='Lava Bow Hero Typo Filled' />
      {isMobile && !repeated ? (
        <Marquee text="LAVA BOW" speed={10} gap={8} />
      ) :
        (
          <img src={HeroOutlined} width={'100%'} height={'auto'} alt='Lava Bow Hero Typo Outlined' />
        )}
      {!repeated && !smallHeight && (
        <img src={HeroFilled} width={'100%'} height={'auto'} alt='Lava Bow Hero Typo Filled' />
      )}
    </Box>
  );
}
