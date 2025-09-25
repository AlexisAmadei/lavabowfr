import React, { useRef, useEffect, useCallback } from 'react'
import './EventTicket.css'
import { Box, Flex } from '@chakra-ui/react'
import Logo from '@/components/Design/Logo'
import LavaButton from '@/components/Design/LavaButton'
import Barcode from 'react-barcode'
import useIsMobile from '../../../hooks/useIsMobile'
import { useMotionValue, animate } from 'framer-motion'

const Divider = ({ orientation }) => {
  if (orientation === 'horizontal')
    return <div style={{ height: '1px', backgroundColor: '#00000052', width: '100%' }} />;
  return <div style={{ width: '1px', backgroundColor: '#00000052', height: '100%' }} />;
};

export default function EventTicket({ event }) {
  const isMobile = useIsMobile();

  // Ref now targets the actual card element (.event-ticket.pkm-v)
  const cardRef = useRef(null);

  const mvRotateX = useMotionValue(0);
  const mvRotateY = useMotionValue(0);
  const mvScale = useMotionValue(1);
  const mvTheta = useMotionValue(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const writeTransform = () => {
      el.style.transform = `perspective(1000px) rotateX(${mvRotateX.get()}deg) rotateY(${mvRotateY.get()}deg) scale(${mvScale.get()})`;
    };

    const u1 = mvRotateX.on('change', writeTransform);
    const u2 = mvRotateY.on('change', writeTransform);
    const u3 = mvScale.on('change', writeTransform);
    const u4 = mvTheta.on('change', (v) => el.style.setProperty('--theta', `${v}deg`));

    writeTransform();
    el.style.setProperty('--theta', `0deg`);

    return () => { u1(); u2(); u3(); u4(); };
  }, [mvRotateX, mvRotateY, mvScale, mvTheta]);

  const maxTilt = 14;

  const onMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const nx = px / r.width;
    const ny = py / r.height;

    const newRY = (nx - 0.5) * (maxTilt * 2);
    const newRX = -(ny - 0.5) * (maxTilt * 2);

    // Centered theta so the gradient truly “spins” around center
    const theta = ((nx - 0.5) - (ny - 0.5)) * 40;

    const spring = { type: 'spring', stiffness: 150, damping: 20 };
    animate(mvRotateY, newRY, spring);
    animate(mvRotateX, newRX, spring);
    animate(mvScale, 1.04, spring);
    animate(mvTheta, theta, spring);

    // Optional CSS vars you already use
    el.style.setProperty('--nx', String(nx));
    el.style.setProperty('--ny', String(ny));
    el.style.setProperty('--dx', `${px - r.width / 2}px`);
    el.style.setProperty('--dy', `${py - r.height / 2}px`);
  }, [mvRotateX, mvRotateY, mvScale, mvTheta]);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const spring = { type: 'spring', stiffness: 150, damping: 20 };
    animate(mvRotateX, 0, spring);
    animate(mvRotateY, 0, spring);
    animate(mvScale, 1, spring);
    animate(mvTheta, 0, spring);
  }, [mvRotateX, mvRotateY, mvScale, mvTheta]);

  return (
    // Put the ref on a plain div to avoid any forwardRef edge case
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      className="event-ticket-hue"
    >
      <Flex
        className="event-ticket pkm-v"
        direction={!isMobile ? "row" : "column"}
        padding="8px"
        gap="10px"
        h="100%"
        w={!isMobile ? "700px" : "100%"}
        maxWidth={!isMobile ? "none" : "400px"}
        alignItems={!isMobile ? "center" : "flex-start"}
      >
        <Flex
          height="100%"
          gap="10px"
          backgroundColor="#f3f3f3ff"
          borderRadius="2px"
          padding="12px"
          justifyContent="space-between"
          width="100%"
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

          <Flex
            className="event-action"
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            h="100%"
            width={!isMobile ? "auto" : "100%"}
            gap="12px"
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
        </Flex>
      </Flex>
      {/* HOLO overlay that spins with --theta */}
      <div className="pkm-v-holo" aria-hidden="true" />
    </div>
  );
}
