import React, { useEffect, useRef, useState } from 'react';

interface RhvSize {
  width: number;
  height: number;
}

export const useSize = <T extends HTMLElement>(
  ref: React.MutableRefObject<T | null | undefined>
) => {
  const [size, setSize] = useState<RhvSize | null>(null);
  const resizeRef$ = useRef<ResizeObserver>();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const handler: ResizeObserverCallback = ([entity]) => {
      const borderBoxSize = entity.borderBoxSize[0];
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const elHeight = borderBoxSize.blockSize;
      const elWidth = borderBoxSize.inlineSize;
      setSize({
        height: Math.max(windowHeight, elHeight),
        width: Math.max(windowWidth, elWidth)
      });
    };
    const resize$ = new ResizeObserver(handler);
    resize$.observe(el);
    resizeRef$.current = resize$;
    return () => {
      resize$.disconnect();
    };
  }, []);

  return [size];
};
