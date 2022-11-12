import React, { useEffect, useRef, useState } from 'react';
import { MayBeEmpty } from '../helpers';

export type DirectionInterestRatio = 'increase' | 'decrease';

export type DirectionScroll = 'down' | 'up';

export interface RhvIntersectState {
  isIntersecting: boolean;
  intersectRatio: number;
  directionInterestRatio?: DirectionInterestRatio;
  directionScrollY?: DirectionScroll;
}

export const useIntersect = <T extends HTMLElement>(
  callback: (state: RhvIntersectState) => RhvIntersectState,
  boundInterestRef: React.MutableRefObject<MayBeEmpty<T>>,
  thresholdCount: number,
  rootElement: MayBeEmpty<Element>
) => {
  const [intersectState, setIntersectState] = useState<RhvIntersectState | null>(null);

  const interestRef$ = useRef<IntersectionObserver>();

  useEffect(() => {
    const el = boundInterestRef.current;
    if (!el) {
      return;
    }

    let previousRatioScope = 0;
    let previousYScope = 0;
    const handler = ([entity]: IntersectionObserverEntry[]) => {
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

      let state: RhvIntersectState = {
        intersectRatio: currentRatio,
        isIntersecting,
        directionInterestRatio,
        directionScrollY
      };
      if (callback) {
        state = callback(state);
      }
      setIntersectState(state);
    };

    const options: IntersectionObserverInit = {
      root: rootElement,
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
  }, [thresholdCount, rootElement]);

  return [intersectState];
};
