import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import LavaTypo from '../../Design/LavaTypo'
import LavaButton from '../../Design/LavaButton'
import useIsMobile from '../../../hooks/useIsMobile'

import { AnimatePresence, motion } from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { fetchSpotlightContent } from '@/utils/supabase/spotlight'

type SpotlightItem = {
  id?: number
  title?: string
  subtitle?: string
  buy_link?: string
  listen_link?: string
  status?: string
}

export default function Spotlight() {
  const isMobile = useIsMobile();
  const mP = isMobile ? '12px 24px' : '12px 32px';

  const [timer, setTimer] = React.useState(0)
  const [spotlightData, setSpotlightData] = React.useState<SpotlightItem[]>([])
  const [activeContent, setActiveContent] = React.useState<SpotlightItem | undefined>(undefined)

  async function fetchSpotlight() {
    await fetchSpotlightContent(setSpotlightData);
  }

  useEffect(() => {
    fetchSpotlight();
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
        <LavaButton variant='filled' padding={mP} onClick={() => window.open(activeContent?.listen_link, '_blank')} className="app-bar__button" style={{ gap: 0 }}>
          <LavaTypo variant={'p'} size={isMobile ? '16px' : '24px'}>Écouter</LavaTypo>
          <span className="app-bar__icon-on-hover">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
        </LavaButton>

        <LavaButton variant='outlined' padding={mP} onClick={() => window.open(activeContent?.buy_link, '_blank')} className="app-bar__button">
          <LavaTypo variant={'p'} size={isMobile ? '16px' : '24px'}>Acheter</LavaTypo>
        </LavaButton>
      </Flex>

    </Flex>
  )
}
