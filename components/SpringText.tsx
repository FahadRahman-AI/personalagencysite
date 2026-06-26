'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrail, animated } from '@react-spring/web';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

interface SpringTextProps {
  text: string;
  tag?: Tag;
  splitBy?: 'char' | 'word';
  delay?: number;
  triggerOnView?: boolean;
  trigger?: boolean;         // external control (e.g. isActive prop)
  className?: string;
  style?: React.CSSProperties;
  tension?: number;
  friction?: number;
}

export default function SpringText({
  text,
  tag: Tag = 'span',
  splitBy = 'word',
  delay = 0,
  triggerOnView = false,
  trigger,
  className,
  style,
  tension = 260,
  friction = 34,
}: SpringTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // IntersectionObserver mode
  useEffect(() => {
    if (!triggerOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnView]);

  // External trigger mode (isActive)
  const active = trigger !== undefined ? trigger : inView;

  const units = splitBy === 'char' ? text.split('') : text.split(' ');

  const trail = useTrail(units.length, {
    y: active ? 0 : 110,
    opacity: active ? 1 : 0,
    config: { mass: 1, tension, friction },
    delay: active ? delay : 0,
  });

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={ref} className={className} style={{ ...style, display: 'block' }} aria-label={text}>
      {trail.map((spring, i) => (
        <span key={i} className="char-wrap">
          <animated.span className="char" style={spring} aria-hidden="true">
            {units[i] === ' ' ? ' ' : units[i]}
          </animated.span>
          {splitBy === 'word' && i < units.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
