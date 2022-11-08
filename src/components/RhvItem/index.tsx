import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRhvContext } from '../../context';
import { RhvItemProps } from '../../interfaces/props';

export type DirectionInterestRatio = 'increase' | 'decrease';
export type DirectionScroll = 'down' | 'up';

export interface RhvScrollState {
  isIntersecting: boolean;
  intersectRatio: number;
  directionInterestRatio?: DirectionInterestRatio;
  directionScrollY?: DirectionScroll;
}

export const RhvItem: React.FC<RhvItemProps> = ({ element }) => {
  const [state] = useRhvContext();
  const [height, setHeight] = useState<number>(0);
  const resizeRef$ = useRef<ResizeObserver>();
  const interestRef$ = useRef<IntersectionObserver>();
  const boundInterestRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState<RhvScrollState>({
    isIntersecting: false,
    intersectRatio: 0
  });

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

      let directionInterestRatio: DirectionInterestRatio;
      let directionScrollY: DirectionScroll;
      if (currentRatio > previousRatioScope && isIntersecting) {
        directionInterestRatio = 'increase';
      } else {
        directionInterestRatio = 'decrease';
      }
      if (currentY > previousYScope && isIntersecting) {
        directionScrollY = 'up';
      } else {
        directionScrollY = 'down';
      }
      previousRatioScope = currentRatio;
      previousYScope = currentY;
      setScrollState({
        intersectRatio: currentRatio,
        isIntersecting,
        directionInterestRatio,
        directionScrollY
      });
    };

    const thresholdCount = state.thresholdCount;
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
  }, [state.thresholdCount]);

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
    const { isIntersecting, intersectRatio, directionInterestRatio, directionScrollY } =
      scrollState;
    const left = height * intersectRatio;
    const leftPercent = (1 - left / windowHeight) * 100;
    const isEffect = !!isIntersecting && leftPercent > 0.25 && height > 0;
    updateAnimation(isEffect);

    if (isEffect) {
      let alignVertical: 'top' | 'bottom';
      let alignHorizontal: 'left' | 'right';
      if (directionScrollY === 'down') {
        alignVertical = directionInterestRatio == 'increase' ? 'top' : 'bottom';
        alignHorizontal = directionInterestRatio === 'increase' ? 'left' : 'right';
      } else {
        alignVertical = directionInterestRatio == 'decrease' ? 'top' : 'bottom';
        alignHorizontal = directionInterestRatio === 'decrease' ? 'left' : 'right';
      }
      style[alignVertical] = 0;
      style[alignHorizontal] = `${leftPercent}%`;
      style.height = `${height}px`;
      classes.push('rhv-item-float');
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [height, scrollState]);

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