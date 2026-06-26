'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrail, animated, config } from '@react-spring/web';

interface Props {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  splitBy?: 'char' | 'word';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

export default function SpringText({
  text,
  tag: Tag = 'span',
  splitBy = 'char',
  delay = 0,
  className,
  style,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const units = splitBy === 'char' ? text.split('') : text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const trail = useTrail(units.length, {
    y: visible ? 0 : 110,
    opacity: visible ? 1 : 0,
    config: { mass: 1, tension: 280, friction: 36 },
    delay: visible ? delay : 0,
  });

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={{ ...style, display: 'block' }} aria-label={text}>
      {trail.map((springs, i) => (
        <span key={i} className="char-wrap">
          <animated.span
            className="char"
            style={springs}
            aria-hidden="true"
          >
            {units[i] === ' ' ? ' ' : units[i]}
          </animated.span>
          {splitBy === 'word' && i < units.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
