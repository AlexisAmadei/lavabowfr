'use client'

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useIsMobile from '@/hooks/useIsMobile';
import './styles/HeroTypo.css';
import Marquee from './Marquee';
import { Box } from '@chakra-ui/react';

import HeroFilled from '@/assets/img/HeroTypo/hero-filled.svg';
import HeroOutlined from '@/assets/img/HeroTypo/hero-outlined.svg';

export default function HeroTypo({ repeated = false }) {
  const isMobile = useIsMobile();
  const [smallHeight, setSmallHeight] = useState(false);
  const [mounted, setMounted] = useState(false);

  const firstImgRef = useRef<HTMLImageElement | null>(null);
  const sizes = '100vw';
  const [marqueeHeight, setMarqueeHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    setSmallHeight(window.innerHeight < 1000);
    setMounted(true);
  }, []);

  useEffect(() => {
    const img = firstImgRef.current;
    if (!img) return;

    const update = () => {
      const h = img.clientHeight;
      setMarqueeHeight(h > 0 ? h : undefined);
    };

    update();

    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(update);
      ro.observe(img);
    } catch (e) {
      // ResizeObserver may not be available in some environments; fallback to window resize
      window.addEventListener('resize', update);
      console.error('ResizeObserver not available, falling back to window resize:', e);
    }

    img.addEventListener('load', update);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
      img.removeEventListener('load', update);
    };
  }, []);

  return (
    <Box className='hero-typo' width={'100%'}>
      <Image
        ref={firstImgRef}
        src={HeroFilled}
        alt='Lava Bow Hero Typo Filled'
        data-title='Lava Bow Hero Typo Filled'
        draggable={false}
        sizes={sizes}
        priority
        style={{ width: '100%', height: 'auto' }}
      />
      {!mounted ? (
        <Image
          src={HeroOutlined}
          alt='Lava Bow Hero Typo Outlined'
          data-title='Lava Bow Hero Typo Outlined'
          draggable={false}
          sizes={sizes}
          style={{ width: '100%', height: 'auto' }}
        />
      ) : isMobile && !repeated ? (
        <Marquee speed={20} gap={30} height={marqueeHeight} />
      ) : (
        <Image
          src={HeroOutlined}
          alt='Lava Bow Hero Typo Outlined'
          data-title='Lava Bow Hero Typo Outlined'
          draggable={false}
          sizes={sizes}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
      {mounted && (!smallHeight || isMobile) && (
        <Image
          src={HeroFilled}
          alt='Lava Bow Hero Typo Filled'
          data-title='Lava Bow Hero Typo Filled'
          draggable={false}
          sizes={sizes}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
    </Box>
  );
}
