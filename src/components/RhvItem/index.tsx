import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRhvContext } from '../../context';
import { RhvItemProps } from '../../interfaces/props';
import { RhvItemState } from '../../interfaces/events';
import { logD, nameEnum } from '../../helpers';

export type DirectionInterestRatio = 'increase' | 'decrease';
export type DirectionScroll = 'down' | 'up';

export interface RhvScrollState {
  isIntersecting: boolean;
  intersectRatio: number;
  directionInterestRatio?: DirectionInterestRatio;
  directionScrollY?: DirectionScroll;
}

interface RhvValueComputed {
  left?: number;
  leftPercent?: number;
  isFloating?: boolean;
}

interface RhvViewport {
  width: number;
  height: number;
}

export const RhvItem: React.FC<RhvItemProps> = ({ element, index }) => {
  const [state] = useRhvContext();
  const [size, setSize] = useState<RhvViewport>({ width: 0, height: 0 });
  const [scrollState, setScrollState] = useState<RhvScrollState>({
    isIntersecting: false,
    intersectRatio: 0
  });
  // need: find solution
  // why useMemo call before use Effect ?
  const [fix, setFix] = useState(0);

  const itemStateRef = useRef<RhvItemState>(RhvItemState.None);
  const valueComputedRef = useRef<RhvValueComputed>({});
  const resizeRef$ = useRef<ResizeObserver>();
  const interestRef$ = useRef<IntersectionObserver>();
  const boundInterestRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  /**
   * Listen element change size
   */
  useEffect(() => {
    const el = elementRef.current;
    if (!el) {
      return;
    }
    const handler: ResizeObserverCallback = ([entity]) => {
      logD('size', index, entity);
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

  /**
   * Listen element intersecting viewport
   */
  useEffect(() => {
    const el = boundInterestRef.current;
    if (!el) {
      return;
    }

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
      if (itemStateRef.current <= RhvItemState.Initial) {
        if (index % 2 === 0) {
          directionInterestRatio = 'decrease';
        } else {
          directionInterestRatio = 'increase';
        }
        directionScrollY = 'down';
        itemStateRef.current = RhvItemState.Initiated;
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
   * Compute value (session current)
   */
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const { isIntersecting, intersectRatio } = scrollState;
    const height = size.height;
    const left = height * intersectRatio;
    const leftPercent = (1 - left / windowHeight) * 100;
    const isFloating = left > 0 && left < windowHeight && height > 0;

    // update item state
    const itemState = itemStateRef.current;
    let newState = itemState;
    if (itemState === RhvItemState.None) {
      newState = RhvItemState.Initial;
    } else if (itemState >= RhvItemState.Initiated) {
      if (left > 0) {
        if (isIntersecting && left >= windowHeight) {
          newState = RhvItemState.Focus;
        } else {
          newState = RhvItemState.Enter;
        }
      } else {
        newState = RhvItemState.Leave;
      }
    }
    // check call event
    if (itemState !== newState) {
      logD('Item', index, nameEnum(RhvItemState)[newState]);
      itemStateRef.current = newState;
    }

    // value cached
    const valueComputed = valueComputedRef.current;
    valueComputed.isFloating = isFloating;
    valueComputed.left = left;
    valueComputed.leftPercent = leftPercent;
    // need: find solution
    setFix((pre) => pre + 1);
  }, [size, scrollState]);

  /**
   * need: update
   * - call events
   * - update animation
   */
  useEffect(() => {
    const { isFloating } = valueComputedRef.current;
    if (isFloating) {
      updateAnimation(isFloating);
    }
  }, [valueComputedRef.current.isFloating]);

  /**
   * Wrapper content props
   * - use snapshot value
   */
  const elementStyles = useMemo(() => {
    const classes: string[] = [];
    const style: React.CSSProperties = {};
    const { directionInterestRatio, directionScrollY } = scrollState;
    const { leftPercent, isFloating } = valueComputedRef.current;
    const { width, height } = size;

    if (isFloating) {
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
      style.width = `${width}px`;
      classes.push('rhv-item-float');
    } else {
      // if position is relative, it some case size not correct
      // need: update
      classes.push('rhv-item-absolute');
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [size, scrollState, fix]);

  const containerStyles = useMemo(() => {
    const classes: string[] = ['rhv-item-wrapper'];
    const style: React.CSSProperties = {};
    const height = size.height;

    if (height > 0) {
      style.height = `${height}px`;
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [size]);

  return (
    <div ref={boundInterestRef} {...containerStyles}>
      <div ref={elementRef} {...elementStyles}>
        {element}
      </div>
    </div>
  );
};
