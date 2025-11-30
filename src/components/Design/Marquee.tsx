// Marquee.jsx
import React from "react";
import HeroOutlined from '@/assets/img/HeroTypo/hero-outlined.svg';
import { motion, useReducedMotion } from "motion/react";

/**
 * SVG Marquee Component
 * Infinitely scrolling SVG image marquee with smooth animation
 * @param {number} height - Height of the SVG in px
 * @param {number} gap - Spacing between SVG copies in px
 * @param {number} speed - Animation speed in px/s (higher = faster)
 * @param {boolean} reverse - Reverse scroll direction
 */
export default function Marquee({
  height=60,
  gap = 60,
  speed,
  reverse = false,
  className = "",
  style = {},
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`marquee-viewport ${className}`}
        style={{
          ...style,
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={HeroOutlined}
          alt="Lava Bow"
          style={{ 
            height: '100%',
            width: 'auto',
            display: 'block'
          }}
        />
      </div>
    );
  }

  // Calculate animation duration based on speed
  // Higher speed = shorter duration = faster animation
  const duration = 20 * (100 / speed);

  return (
    <div
      className={`marquee-viewport ${className}`}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
      aria-label="Lava Bow scrolling marquee"
    >
      <motion.div
        className="marquee-track"
        style={{
          display: "flex",
          flexShrink: 0,
          gap: `${gap}px`,
          minWidth: "100%",
        }}
        animate={{
          x: reverse ? ["0%", "50%"] : ["0%", "-50%"],
        }}
        transition={{
          x: {
            duration,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate content for seamless loop */}
        <MarqueeContent gap={gap} height={height} />
        <MarqueeContent gap={gap} height={height} />
      </motion.div>
    </div>
  );
}

function MarqueeContent({ gap, height }) {
  // Number of copies to ensure full coverage
  const copies = 10;

  return (
    <>
      {Array.from({ length: copies }).map((_, i) => (
        <img
          key={i}
          src={HeroOutlined}
          alt=""
          style={{
            height: `${height}px`,
            width: 'auto',
            display: 'block',
            flexShrink: 0,
          }}
        />
      ))}
    </>
  );
}
