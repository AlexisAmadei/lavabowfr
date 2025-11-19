// Marquee.jsx
import React from "react";

// eslint-disable-next-line
import { motion, useReducedMotion } from "motion/react";

/**
 * Marquee
 * @param {string} text - The text to scroll
 * @param {number} speed - px per second (higher = faster)
 * @param {number} gap - gap between copies in px
 * @param {boolean} reverse - scroll direction
 */
export default function Marquee({
  text = "LAVABOW",
  speed = 120,      // px/s
  gap = 48,
  reverse = false,
  className = "",
  style = {},
}) {
  const shouldReduceMotion = useReducedMotion();

  // Distance of one full loop (we’ll measure via CSS variable)
  const direction = reverse ? -1 : 1;

  // When reduced motion is requested, just show static text.
  if (shouldReduceMotion) {
    return (
      <div
        className={`marquee-viewport ${className}`}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ paddingRight: gap }}>{text}</span>
      </div>
    );
  }

  // We can’t measure here without refs; instead we animate a percentage track.
  // The trick: duplicate the track twice and animate from 0% to -50%.
  // 50% shift equals one track width because we have two identical tracks.
  const animateFrom = "0%";
  const animateTo = "-50%";
  const baseTransition = {
    ease: "linear",
    duration: 1, // will be scaled by CSS transform; we’ll multiply via speedRatio
    repeat: Infinity,
  };

  // We’ll scale duration based on font size via a CSS var → consistent feel.
  // To keep it simple here, we derive duration from container width using %.
  // 1 → OK; if you want precise px-based speed, use a ref to measure width.

  return (
    <div
      className={`marquee-viewport ${className}`}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        display: "block",
        // Optional fading edges:
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
      aria-label={`${text} scrolling marquee`}
    >
      <motion.div
        className="marquee-track"
        style={{
          display: "inline-flex",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          gap: `${gap}px`,
          // Direction control:
          // Using rotateY for direction keeps layout simple; or just swap to/from.
          transform: `scaleX(${direction})`,
        }}
        animate={{ x: [animateFrom, animateTo] }}
        transition={{
          ...baseTransition,
          // Duration tuned so that ~120 px/s feels right for typical font sizes.
          // Adjust with the prop `speed` by scaling the base duration:
          // Larger speed → shorter duration (faster).
          duration: 20 * (120 / speed),
        }}
      >
        {/* Two identical copies to make the loop seamless */}
        <Track text={text} gap={gap} />
        <Track text={text} gap={gap} />
      </motion.div>
    </div>
  );
}

function Track({ text, gap }) {
  // Repeat the word enough times to overflow the viewport (responsive).
  // Using an array of spans keeps spacing consistent.
  const copies = 12; // tweak if your text is short/long
  return (
    <div
      style={{
        display: "inline-flex",
        gap: `${gap}px`,
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      {Array.from({ length: copies }).map((_, i) => (
        <p
          key={i}
          id='outline'
          style={{
            display: "inline-block",
            fontWeight: 800,
            letterSpacing: "0.08em",
            // Make it big and responsive; you can style via className instead.
            // fontSize: "clamp(24px, 8vw, 120px)",
            lineHeight: 1,
          }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
