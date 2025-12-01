import { useEffect, useState } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import IconClick from '@/assets/icons/click.svg'
import { supabase } from '@/utils/supabase/supabase'
import Counter from '@/components/react-bits/Counter/Counter'

export default function ClickCounter({ count, setCount, isMobile }: { count: number; setCount: (count: number) => void; isMobile: boolean }) {
  const [clickUsed, setClickUsed] = useState(false);

  async function triggerClickUsage() {
    await supabase.rpc('increment_click_count', { row_id: 1, step: 1 })
    setClickUsed(true);
  }

  useEffect(() => {
    if (clickUsed) {
      const timer = setTimeout(() => {
        setClickUsed(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [clickUsed]);

  useEffect(() => {
    // Load initial count
    const loadCount = async () => {
      const { data } = await supabase
        .from('section_click')
        .select('count')
        .eq('id', 1)
        .single()
      setCount(data?.count || 0)
    }
    loadCount()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:section_click')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'section_click', filter: 'id=eq.1' },
        (payload) => {
          setCount(payload.new.count)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setCount])

  const handleClick = async () => {
    if (clickUsed) return;
    await triggerClickUsage();
  }

  const getPlacesForValue = (v: number) => {
    const digits = v > 0 ? Math.floor(Math.log10(v)) + 1 : 1;
    const placesCount = Math.max(3, digits);
    const places: number[] = [];
    for (let i = placesCount - 1; i >= 0; i--) {
      places.push(10 ** i);
    }
    return places;
  };

  return (
    <LavaButton
      variant='filled'
      color='primary'
      onClick={handleClick}
      style={{
        display: 'flex',
        padding: isMobile ? '12px 24px' : '24px 48px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--Spacing-spacing-xxl, 16px)',
      }}
    >
      <Counter
        value={count}
        places={getPlacesForValue(count)}
        fontSize={30}
        textColor='white'
        fontWeight={'bold'}
        padding={8}
        containerStyle={{
          backgroundColor: 'transparent'
        }}
        gradientFrom='transparent'
        gap={4}
      />
      <img src={IconClick} alt='Click Icon' style={{ marginLeft: '8px' }} height={isMobile ? '24px' : '32px'} />
    </LavaButton>
  )
}
