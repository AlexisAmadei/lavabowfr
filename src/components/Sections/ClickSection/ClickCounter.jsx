import React, { useEffect } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import IconClick from '@/assets/icons/click.svg'
import { supabase } from '@/utils/supabase/supabase'

export default function ClickCounter({ setCount, isMobile }) {

  useEffect(() => {
    // Load initial count
    const loadCount = async () => {
      const { data } = await supabase
        .from('section_click')
        .select('count')
        .eq('id', 1)
        .single()
      setCount(data.count)
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
      <LavaTypo variant={'h4'}
        styles={{
          color: 'var(--Text-text-primary, #FFF)',
          fontFamily: 'Stack Sans Text',
          fontSize: isMobile ? '20px' : '24px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: 'normal',
        }}
      >
        CLIQUE
      </LavaTypo>
      <img src={IconClick} alt='Click Icon' style={{ marginLeft: '8px' }} height={isMobile ? '24px' : '32px'} />
    </LavaButton>
  )
}
