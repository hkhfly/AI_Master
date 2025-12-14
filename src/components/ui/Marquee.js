import React from 'react';
import { cn } from '../../lib/utils';
import './Marquee.css';

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        'marquee-container',
        vertical ? 'vertical' : 'horizontal',
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'marquee-content',
            vertical ? 'vertical' : 'horizontal',
            reverse ? 'reverse' : '',
            pauseOnHover ? 'pause-on-hover' : ''
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
