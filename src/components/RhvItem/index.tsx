import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface RhvItemProps {
  element: React.ReactElement;
  index: number;
}

export const RhvItem: React.FC<RhvItemProps> = ({ element }) => {
  const [height, setHeight] = useState<number>(0);
  const [isInteresting, setInteresting] = useState<boolean>();
  const [previousRatio, setPreviousRatio] = useState<number>(0);
  const [directionRatio, setDirectionRatio] = useState<'increase' | 'decrease'>();
  const [directionY, setDirectionY] = useState<'down' | 'up'>();
  const resizeRef$ = useRef<ResizeObserver>();
  const interestRef$ = useRef<IntersectionObserver>();
  const boundInterestRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const el = elementRef.current;
    if (!el) {
      return;
    }
    const handler: ResizeObserverCallback = () => {
      const elHeight = el?.clientHeight || 0;
      setHeight(Math.max(windowHeight, elHeight));
    };
    const resize$ = new ResizeObserver(handler);
    resize$.observe(el);
    resizeRef$.current = resize$;

    return () => {
      resize$.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = boundInterestRef.current;
    if (!el) {
      return;
    }
    // use variable 'previousRatioScope' because 'previousCurrent' not change
    // use variable 'previousYScope' because 'previousY' not change
    let previousRatioScope = 0;
    let previousYScope = 0;

    const handler = (entries: IntersectionObserverEntry[]) => {
      const entity = entries[0];
      const currentRatio = entity.intersectionRatio;
      const currentY = entity.boundingClientRect.y;
      const isIntersecting = entity.isIntersecting;

      let dirRatio: typeof directionRatio;
      let dirY: typeof directionY;
      if (currentRatio > previousRatioScope && isIntersecting) {
        dirRatio = 'increase';
      } else {
        dirRatio = 'decrease';
      }
      if (currentY > previousYScope && isIntersecting) {
        dirY = 'up';
      } else {
        dirY = 'down';
      }
      previousRatioScope = currentRatio;
      previousYScope = currentY;

      setDirectionY(dirY);
      setDirectionRatio(dirRatio);
      setPreviousRatio(currentRatio);
      setInteresting(isIntersecting);
    };

    const thresholdCount = 500;
    const options: IntersectionObserverInit = {
      rootMargin: '0px',
      threshold: Array.from({ length: thresholdCount }).map(
        (_, index) => (index + 1) / thresholdCount
      )
    };
    const interest$ = new IntersectionObserver(handler, options);
    interest$.observe(el);
    interestRef$.current = interest$;
    return () => {
      interest$.disconnect();
      interestRef$.current = undefined;
    };
  }, []);

  const updateAnimation = (status: boolean) => {
    const el = elementRef.current;
    if (!el) {
      return;
    }

    const propPlayState = 'play-state';
    if (status) {
      const playState = el.getAttribute(propPlayState);
      if (playState !== 'true') {
        el.setAttribute(propPlayState, '');
      }
    } else {
      if (el.hasAttribute(propPlayState)) {
        el.removeAttribute(propPlayState);
      }
    }
  };

  const elementStyles = useMemo(() => {
    const classes: string[] = [];
    const style: React.CSSProperties = {};
    const windowHeight = window.innerHeight;
    const left = height * previousRatio;
    const leftPercent = (1 - left / windowHeight) * 100;
    const isEffect = !!isInteresting && leftPercent > 0.25 && height > 0;
    updateAnimation(isEffect);

    if (isEffect) {
      let alignVertical: 'top' | 'bottom';
      let alignHorizontal: 'left' | 'right';
      if (directionY === 'down') {
        alignVertical = directionRatio == 'increase' ? 'top' : 'bottom';
        alignHorizontal = directionRatio === 'increase' ? 'left' : 'right';
      } else {
        alignVertical = directionRatio == 'decrease' ? 'top' : 'bottom';
        alignHorizontal = directionRatio === 'decrease' ? 'left' : 'right';
      }
      style[alignVertical] = 0;
      style[alignHorizontal] = `${leftPercent}%`;
      classes.push('rhv-item-float');
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [isInteresting, previousRatio, height, directionRatio, directionY]);

  const containerStyles = useMemo(() => {
    const classes: string[] = ['rhv-item-wrapper'];
    const style: React.CSSProperties = {};

    if (height > 0) {
      style.height = `${height}px`;
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [height]);

  return (
    <div ref={boundInterestRef} {...containerStyles}>
      <div ref={elementRef} {...elementStyles}>
        {element}
      </div>
    </div>
  );
};
