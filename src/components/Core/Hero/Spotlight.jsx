import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import LavaTypo from '../../Design/LavaTypo'
import LavaButton from '../../Design/LavaButton'
import useIsMobile from '../../../hooks/useIsMobile'
import { SPOTLIGHT_CONTENT } from '@/constants/spotlight'
import { AnimatePresence, motion } from "motion/react"

export default function Spotlight() {
  const isMobile = useIsMobile();
  const mP = isMobile ? '12px 24px' : '12px 32px';

  const [timer, setTimer] = React.useState(0);
  const [activeContent, setActiveContent] = React.useState(SPOTLIGHT_CONTENT[timer]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        const nextIndex = (prev + 1) % SPOTLIGHT_CONTENT.length;
        setActiveContent(SPOTLIGHT_CONTENT[nextIndex]);
        return nextIndex;
      });
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
          <LavaTypo variant={'h2'} styles={{ marginBottom: isMobile ? '8px' : '' }}>{activeContent.title}</LavaTypo>
          <LavaTypo variant={'text'} styles={{ marginBottom: !isMobile ? '24px' : '' }}>{activeContent.subtitle}</LavaTypo>
        </motion.div>
      </AnimatePresence>

      {/* Static buttons */}
      <Flex direction={'row'} gap={4} marginTop={4}>
        <LavaButton variant='filled' padding={mP} onClick={() => window.open(activeContent.link, '_blank')}>
          <LavaTypo variant='text' size={isMobile ? '6vw' : '24px'}>Écouter</LavaTypo>
        </LavaButton>
        <LavaButton variant='outlined' padding={mP}>
          <LavaTypo variant='text' size={isMobile ? '6vw' : '24px'}>Acheter</LavaTypo>
        </LavaButton>
      </Flex>

    </Flex>
  )
}
