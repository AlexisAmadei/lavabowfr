import { useEffect } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import IconClick from '@/assets/icons/click.svg'
import { supabase } from '@/utils/supabase/supabase'
import Counter from '@/components/react-bits/Counter/Counter'

export default function ClickCounter({ count, setCount, isMobile }: { count: number; setCount: (count: number) => void; isMobile: boolean }) {

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
  }, [])

  const handleClick = async () => {
    await supabase.rpc('increment_click_count', { row_id: 1, step: 1 })
  }

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
