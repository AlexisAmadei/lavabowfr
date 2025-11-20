import React, { useEffect } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import IconClick from '@/assets/icons/click.svg'
import { supabase } from '@/utils/supabase/supabase'

export default function ClickCounter({ setCount }) {

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
    <LavaButton variant='filled' color='primary' size='large' onClick={handleClick}>
      <LavaTypo variant={'h4'}>CLIQUE</LavaTypo>
      <img src={IconClick} alt='Click Icon' style={{ marginLeft: '8px' }} />
    </LavaButton>
  )
}
