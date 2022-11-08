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

export const RhvItem: React.FC<RhvItemProps> = ({ element, index }) => {
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

  /**
   * Listen element change size
   */
  useEffect(() => {
    const el = elementRef.current;
    if (!el) {
      return;
    }
    const handler: ResizeObserverCallback = () => {
      const windowHeight = window.innerHeight;
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

  /**
   * Listen element intersecting viewport
   */
  useEffect(() => {
    const el = boundInterestRef.current;
    if (!el) {
      return;
    }

    let init = false;
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

      // the previous value is initially 0 so the direction cannot be calculated
      if (!init && isIntersecting) {
        if (index % 2 === 0) {
          directionInterestRatio = 'decrease';
        } else {
          directionInterestRatio = 'increase';
        }
        directionScrollY = 'down';
        init = true;
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
      root: state.rootElement,
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
  }, [state.thresholdCount, state.rootElement]);

  /**
   * need: update
   * @param status
   */
  const updateAnimation = (status: boolean) => {
    const el = elementRef.current;
    if (!el || !state.pauseAnimation) {
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

  /**
   * Snapshot value (session current)
   */
  let left: number;
  let leftPercent: number;

  /**
   * Compute value (session current)
   */
  const isEffect = useMemo(() => {
    const windowHeight = window.innerHeight;
    const { isIntersecting, intersectRatio } = scrollState;
    left = height * intersectRatio;
    leftPercent = (1 - left / windowHeight) * 100;
    return !!isIntersecting && leftPercent > 0.25 && height > 0;
  }, [height, scrollState]);

  /**
   * need: update
   * - call events
   * - update animation
   */
  useEffect(() => {
    if (isEffect) {
      updateAnimation(isEffect);
    }
  }, [isEffect]);

  // ????
  // need: fixed
  useEffect(() => {
    if (!isEffect && scrollState.directionInterestRatio === 'increase') {
      elementRef.current?.scrollIntoView();
    }
  }, [isEffect, scrollState]);

  /**
   * Wrapper content props
   * - use snapshot value
   */
  const elementStyles = useMemo(() => {
    const classes: string[] = [];
    const style: React.CSSProperties = {};
    const { directionInterestRatio, directionScrollY } = scrollState;

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
  }, [height, scrollState, isEffect]);

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
