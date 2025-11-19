import React, { useEffect } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import { Flex } from '@chakra-ui/react'
import IconClick from '@/assets/icons/click.svg'
import IconBeer from '@/assets/icons/beer.svg'

const CLICK_PALIERS = [
  { id: 1, count: 10000, description: "Alexis en string sur scène" },
  { id: 2, count: 100000, description: "Sam apprend la basse" },
  { id: 3, count: 1000000, description: "On fait la LAVA BOOM 2" },
  { id: 4, count: 10000000, description: "Lava Bow en concert à l'Olympia" },
];

export default function ClickSection() {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = () => {
    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      localStorage.setItem('clickCount', newCount);
      return newCount;
    });
  };

  const isPalierReached = (palierCount) => clickCount >= palierCount;

  const getProgressPercentage = (index) => {
    const palier = CLICK_PALIERS[index];
    const previousPalier = index > 0 ? CLICK_PALIERS[index - 1] : { count: 0 };

    if (clickCount >= palier.count) return 100;
    if (clickCount < previousPalier.count) return 0;

    const progress = ((clickCount - previousPalier.count) / (palier.count - previousPalier.count)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  useEffect(() => {
    const storedClickCount = localStorage.getItem('clickCount');
    if (storedClickCount) {
      setClickCount(Number(storedClickCount));
    }
  }, []);

  return (
    <Section title="Click Section" styles={{ marginTop: '60px', marginBottom: '60px' }}>
      <Flex gap={3} direction={'column'} alignItems={'center'} marginBottom={'48px'}>
        <LavaTypo variant={'h2'}>Clique to pay</LavaTypo>
      </Flex>

      <Flex
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={4}
      >
        <Flex direction={'row'} alignItems={'center'} gap={4}>
          <LavaButton variant='filled' color='primary' size='large' onClick={handleClick}>
            <LavaTypo variant={'h4'}>CLIQUE</LavaTypo>
            <img src={IconClick} alt='Click Icon' style={{ marginLeft: '8px' }} />
          </LavaButton>
          <LavaTypo variant={'text'}>{clickCount} clique{clickCount > 1 ? 's' : ''}</LavaTypo>
        </Flex>

        <Flex direction={'column'} alignItems={'center'} marginTop={4}>
          <LavaTypo variant={'h4'}>Clique et débloque des paliers :</LavaTypo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '16px', width: '100%' }}>
            {CLICK_PALIERS.map((palier, index) => {
              const progress = getProgressPercentage(index);
              return (
                <div key={palier.id} id={`palier-${palier.id}`} style={{ position: 'relative', overflow: 'hidden', border: '1px solid white', borderRadius: 50, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${progress}%`,
                      backgroundColor: 'var(--Background-bg-brand)',
                      transition: 'width 0.3s ease',
                      zIndex: 0,
                      borderRadius: 50
                    }}
                  />
                  <Flex style={{ position: 'relative', zIndex: 1, alignItems: 'center', gap: '8px', flex: 1 }} direction={'row'} justifyContent={'center'} alignItems={'center'}>
                    <LavaTypo variant={'h3'} size={24} styles={{ color: isPalierReached(palier.count) ? 'white' : 'var(--main-accent)' }}>{palier.count} cliques</LavaTypo>
                    <span style={{ fontWeight: 'bold', fontSize: '20px', color: 'white' }}> - </span>
                    <LavaTypo variant={'text'} size={16} styles={{ color: 'white' }}>{palier.description}</LavaTypo>
                  </Flex>
                </div>
              );
            })}
          </div>

          <Flex direction={'row'} mt={'24px'}>
            {CLICK_PALIERS.map((palier, index) => {
              const progress = getProgressPercentage(index);
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
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </Section>
  )
}
