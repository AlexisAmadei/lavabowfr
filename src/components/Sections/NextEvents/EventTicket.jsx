import React, { useRef, useEffect, useCallback } from 'react'
import './EventTicket.css'
import { Flex } from '@chakra-ui/react'
import useIsMobile from '../../../hooks/useIsMobile'
import { useMotionValue, animate } from 'framer-motion'
import Divider from '@/components/Design/Divider'
import EventInfos from './EventInfos'
import EventActions from './EventActions'
import defaultImg from '@/assets/img/events/events-1.webp'

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
        padding="6px"
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
          padding="12px"
          justifyContent="space-between"
          direction={!isMobile ? "row" : "column"}
          width="100%"
        >
          <Flex direction="column" gap="6px" alignItems="flex-start" className="title-img" width={!isMobile ? "auto" : "100%"}>
            <span className="event-title">{event.title}</span>
            <div
              style={{
                background: `url(${event.img || defaultImg})`,
                width: '200px',
                height: '120px',
                objectFit: 'cover',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Flex>

          <Divider orientation={!isMobile ? "vertical" : "horizontal"} />

          <EventInfos event={event} />

          <Divider orientation={!isMobile ? "vertical" : "horizontal"} />

          <EventActions />
        </Flex>
      </Flex>

    </div>
  );
}
