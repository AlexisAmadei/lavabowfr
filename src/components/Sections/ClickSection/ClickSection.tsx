import React, { useEffect } from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import Section from '@/components/Design/Section'
import { Flex } from '@chakra-ui/react'
import ClickCounter from './ClickCounter'
import useIsMobile from '@/hooks/useIsMobile'
import BeerGauge from './BeerGauge'
import ClickSpark from '@/components/react-bits/ClickSpark'
import { fetchClicksContent } from '@/utils/supabase/click_palier'
import { ClicksItem } from '@/types/types'
import { useTranslation } from '@/i18n/useTranslation'

export default function ClickSection() {
  const [clickCount, setClickCount] = React.useState(0);
  const [clicksItems, setClicksItems] = React.useState<ClicksItem[]>([]);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  function getProgressPercentage(index: number): number {
    const palier = clicksItems[index]
    const previousPalier = index > 0 ? clicksItems[index - 1] : { target: 0 }

    if (clickCount >= palier.target) return 100
    if (clickCount < previousPalier.target) return 0

    const progress = ((clickCount - previousPalier.target) / (palier.target - previousPalier.target)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const isPalierReached = (palierCount: number): boolean => clickCount >= palierCount;

  async function fetchClicksPaliers() {
    await fetchClicksContent(setClicksItems);
  }

  useEffect(() => {
    const storedClickCount = localStorage.getItem('clickCount');
    if (storedClickCount) {
      setClickCount(Number(storedClickCount));
    }
    fetchClicksPaliers();
  }, []);

  return (
    <Section title={t.click.title}>
      <ClickSpark>

        <Flex
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={4}
        >
          <ClickCounter count={clickCount} setCount={setClickCount} isMobile={!isMobile} />

          <Flex direction={'column'} alignItems={'center'} marginTop={4}>
            <LavaTypo variant={'h4'}>{t.click.unlockTiers}</LavaTypo>

            <div style={{ display: 'grid', gridTemplateColumns: `${!isMobile ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'}`, gap: `${isMobile ? '10px' : '16px'}`, marginTop: '16px', width: '100%' }}>
              {clicksItems.map((palier, index) => {
                const progress = getProgressPercentage(index);
                return (
                  <div key={palier.id} id={`palier-${palier.id}`} style={{ position: 'relative', overflow: 'hidden', border: '1px solid white', borderRadius: 50, padding: `${isMobile ? '0px 8px' : '12px 20px'}`, display: 'flex', alignItems: 'center', gap: '12px', minHeight: `${isMobile ? '48px' : '64px'}` }}>
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
                      <LavaTypo variant={'h3'} size={!isMobile ? 24 : 16} styles={{ color: isPalierReached(palier.target) ? 'white' : 'var(--main-accent)' }}>{palier.target} {t.click.clicksSuffix}</LavaTypo>
                      <span style={{ fontWeight: 'bold', fontSize: `${isMobile ? '14px' : '20px'}`, color: 'white' }}> - </span>
                      <LavaTypo variant={'p'} size={isMobile ? 12 : 18} styles={{ color: 'white' }}>{palier.name}</LavaTypo>
                    </Flex>
                  </div>
                );
              })}
            </div>

            <Flex direction={'row'} mt={'24px'} gap={8}>
              {clicksItems.map((palier, index) => (
                <BeerGauge
                  key={index}
                  palier={palier}
                  progress={getProgressPercentage(index)}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </ClickSpark>
    </Section>
  )
}
