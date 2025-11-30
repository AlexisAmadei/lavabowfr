import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import LavaTypo from '../../Design/LavaTypo'
import LavaButton from '../../Design/LavaButton'
import useIsMobile from '../../../hooks/useIsMobile'
import { supabase } from '@/utils/supabase/supabase'

import { AnimatePresence, motion } from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'

type SpotlightItem = {
  id?: number
  title?: string
  subtitle?: string
  link?: string
  status?: string
}

export default function Spotlight() {
  const isMobile = useIsMobile();
  const mP = isMobile ? '12px 24px' : '12px 32px';

  const [timer, setTimer] = React.useState(0)
  const [spotlightData, setSpotlightData] = React.useState<SpotlightItem[]>([])
  const [activeContent, setActiveContent] = React.useState<SpotlightItem | undefined>(undefined)

  async function fetchSpotlightData() {
    try {
      const { data: section_spotlight, error } = await supabase
        .from('section_spotlight')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching spotlight content:', error);
        return;
      }
      setSpotlightData((section_spotlight ?? []) as SpotlightItem[]);
    } catch (error) {
      console.error('Error fetching spotlight content:', error);
    }
  }

  useEffect(() => {
    fetchSpotlightData();
  }, []);

  React.useEffect(() => {
    if (spotlightData.length === 0) {
      setActiveContent(undefined)
      return
    }

    setActiveContent(spotlightData[0])
    setTimer(0)

    const interval = setInterval(() => {
      setTimer(prev => {
        const nextIndex = (prev + 1) % spotlightData.length
        setActiveContent(spotlightData[nextIndex])
        return nextIndex
      })
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [spotlightData])


  if (spotlightData.length === 0 || !activeContent) {
    return null; // hide spotlight if no content available
  }

  return (
    <Flex direction={'column'} alignItems={isMobile ? 'center' : 'flex-end'} width={isMobile ? '100%' : 'auto'} className='spotlight'>

      {/* Animated title and description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={timer} // the key changes with each cycle, triggering exit/enter animations
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-end' }}
        >
          <LavaTypo variant={'h2'} textAlign={isMobile ? 'center' : 'left'} styles={{ marginBottom: isMobile ? '8px' : '' }}>“{activeContent?.title}”</LavaTypo>
          <LavaTypo variant={'p'} styles={{ marginBottom: !isMobile ? '24px' : '' }}>{activeContent?.subtitle}</LavaTypo>
        </motion.div>
      </AnimatePresence>

      {/* Static buttons */}
      <Flex direction={'row'} gap={4} marginTop={4}>
        <LavaButton variant='filled' padding={mP} onClick={() => window.open(activeContent?.link, '_blank')} className="app-bar__button">
          <LavaTypo variant={'p'} size={isMobile ? '16px' : '24px'}>Écouter</LavaTypo>
          <span className="app-bar__icon-on-hover">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
        </LavaButton>

        <LavaButton variant='outlined' padding={mP} onClick={() => window.open('https://www.bandsintown.com/es/a/15589958-lava-bow?came_from=209', '_blank')} className="app-bar__button">
          <LavaTypo variant={'p'} size={isMobile ? '16px' : '24px'}>Acheter</LavaTypo>
        </LavaButton>
      </Flex>

    </Flex>
  )
}
