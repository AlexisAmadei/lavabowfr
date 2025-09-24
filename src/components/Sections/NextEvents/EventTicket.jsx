import React, { useRef } from 'react'
import './EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Logo from '@/components/Design/Logo'
import LavaButton from '@/components/Design/LavaButton'
import Barcode from 'react-barcode'
import useIsMobile from '../../../hooks/useIsMobile'

const Divider = ({ orientation }) => {
  if (orientation === 'horizontal')
    return <div style={{ height: '1px', backgroundColor: '#00000052', width: '100%' }} />;
  return <div style={{ width: '1px', backgroundColor: '#00000052', height: '100%' }} />;
}

export default function EventTicket({ event }) {
  const isMobile = useIsMobile();
  const cardRef = useRef(null)

  const onMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    const nx = px / r.width
    const ny = py / r.height

    // keep these if you use them for tilt / inner parallax
    el.style.setProperty('--dx', `${px - r.width / 2}px`)
    el.style.setProperty('--dy', `${py - r.height / 2}px`)
    el.style.setProperty('--nx', nx)
    el.style.setProperty('--ny', ny)

    // tilt (outer) + gentle content parallax (inner) — as you have
    const maxTilt = 14
    const rx = (0.5 - ny) * (maxTilt * 2)
    const ry = (nx - 0.5) * (maxTilt * 2)
    el.style.setProperty('--rx', `${rx}deg`)
    el.style.setProperty('--ry', `${ry}deg`)
    // Removed inner parallax
    el.style.setProperty('--tx', `0px`)
    el.style.setProperty('--ty', `0px`)

    // NEW: rotate holo only (center stays fixed)
    const theta = ((nx - 5) - (ny - 5)) * 20 // tweak 720 for speed
    el.style.setProperty('--theta', `${theta}deg`)
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--theta', `0deg`)
    el.style.setProperty('--rx', `0deg`)
    el.style.setProperty('--ry', `0deg`)
    el.style.setProperty('--tx', `0px`)
    el.style.setProperty('--ty', `0px`)
  }

  return (
    <Flex
      ref={cardRef}
      className="event-ticket pkm-v"
      direction={!isMobile ? "row" : "column"}
      padding="8px"
      gap="10px"
      h="100%"
      w={!isMobile ? "700px" : "100%"}
      maxWidth={!isMobile ? "none" : "400px"}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      alignItems={!isMobile ? "center" : "flex-start"}
    >
      <Flex
        height={'100%'}
        gap={'10px'}
        backgroundColor={'#f3f3f3ff'}
        borderRadius={'2px'}
        padding={'12px'}
        justifyContent={'space-between'}
        width={'100%'}
      >

        <Flex direction="column" gap="6px" alignItems="flex-start" className="title-img" width={!isMobile ? "auto" : "100%"}>
          <span className="event-title">{event.title}</span>
          <div
            style={{
              background: `url(${event.img})`,
              width: '100%',
              height: '115px',
              objectFit: 'cover',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Flex>

        <Divider orientation={!isMobile ? "vertical" : "horizontal"} />

        <Flex className="event-infos" direction="column" justifyContent="space-between">
          <p className="event-description">{event.description}</p>
          <Box width="100%">
            <Flex className="event-details" direction="row" justifyContent="space-between" pb={1}>
              <p>PRIX</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
              <p>{event.price}€</p>
            </Flex>
            <Flex className="event-details" direction="row" justifyContent="space-between" pb={1}>
              <p>DATE</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
              <p>{event.date}</p>
            </Flex>
            <Flex className="event-details" direction="row" justifyContent="space-between">
              <p>LIEU</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
              <p>{event.location}</p>
            </Flex>
          </Box>
        </Flex>

        <Divider orientation={!isMobile ? "vertical" : "horizontal"} />

        <Flex className="event-action"
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          h="100%"
          width={!isMobile ? "auto" : "100%"}
          gap={'12px'}
        >
          <div style={{ alignSelf: isMobile ? "center" : "flex-end" }}>
            <Logo h="35px" w="35px" />
          </div>

          <Flex direction="column" alignItems="center" gap={3}>
            <Box style={{ height: '33px', width: '194px' }} overflow="hidden" className="barcode-container">
              <Barcode value="lavabow" height={33} displayValue={false} margin={0} background="transparent" />
            </Box>
            <LavaButton variant="filled" style={{ width: '100%' }}>
              Je prends ma place
            </LavaButton>
          </Flex>
        </Flex>

        {/* Optional: noise overlay as real node (easier to tune) */}
      </Flex>
      {/* <div className="pkm-v-noise" /> */}
    </Flex>
  )
}
