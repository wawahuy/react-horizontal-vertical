import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useRhvContext } from '../../context';
import { RhvItemProps } from '../../interfaces/props';
import { RhvItemState } from '../../interfaces/events';
import { logD, nameEnum, updateAttribute } from '../../helpers';
import { useSize } from '../../hooks/use-size';
import { useIntersect } from '../../hooks/use-intersect';

interface RhvValueComputed {
  left: number;
  leftPercent: number;
  isFloating: boolean;
}

export const RhvItem: React.FC<RhvItemProps> = ({ element, index, onStateChange }) => {
  const valueComputedRef = useRef<RhvValueComputed>({
    left: 0,
    leftPercent: 0,
    isFloating: false
  });
  const itemStateRef = useRef<RhvItemState>(RhvItemState.None);
  const boundInterestRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [state] = useRhvContext();
  const [size] = useSize(elementRef);
  const [intersectState] = useIntersect(
    (state) => {
      // the previous value is initially 0 so the direction cannot be calculated
      if (itemStateRef.current <= RhvItemState.Initial) {
        if (index % 2 === 0) {
          state.directionInterestRatio = 'decrease';
        } else {
          state.directionInterestRatio = 'increase';
        }
        state.directionScrollY = 'down';
        itemStateRef.current = RhvItemState.Initiated;
      }
      return state;
    },
    boundInterestRef,
    state.thresholdCount,
    state.rootElement
  );

  const emitEvent = (s: RhvItemState) => {
    setTimeout(() => {
      logD('emit', index);
      if (onStateChange) {
        onStateChange(s, index, elementRef.current);
      }
      if (state.onStateChange) {
        state.onStateChange(s, index, elementRef.current);
      }
    });
  };

  /**
   * Wrapper content props
   */
  const elementStyles = useMemo(() => {
    const classes: string[] = [];
    const style: React.CSSProperties = {};
    const windowHeight = window.innerHeight;
    const { directionInterestRatio, directionScrollY, intersectRatio } = intersectState;
    const { width, height } = size;
    const left = height * intersectRatio;
    const leftPercent = (1 - left / windowHeight) * 100;
    const isFloating = left > 0 && left < windowHeight && height > 0;

    // value cached
    // compute inside useMemo because useEffect call after.
    const valueComputed = valueComputedRef.current;
    valueComputed.isFloating = isFloating;
    valueComputed.left = left;
    valueComputed.leftPercent = leftPercent;

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
      // need: find solution use relative
      classes.push('rhv-item-absolute');
    }

    const className = classes.join(' ');
    return {
      className,
      style
    };
  }, [size, intersectState]);

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

  /**
   * Compute value (session current)
   */
  useLayoutEffect(() => {
    const windowHeight = window.innerHeight;
    const { isIntersecting } = intersectState;
    const { left, isFloating } = valueComputedRef.current;

    // update item state
    const itemState = itemStateRef.current;
    let newState = itemState;
    if (itemState === RhvItemState.None) {
      newState = RhvItemState.Initial;
    } else if (itemState >= RhvItemState.Initiated) {
      // need: update
      if (itemState === RhvItemState.Initiated) {
        logD('Item', index, nameEnum(RhvItemState)[newState]);
        emitEvent(newState);
      }

      const leftError = 0.5;
      if (left >= leftError) {
        if (isIntersecting && left >= windowHeight - leftError) {
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
      emitEvent(newState);

      // pause/play animation
      const element = elementRef.current;
      if (element && state.pauseAnimation) {
        logD('Animation', index, isFloating);
        updateAttribute(element, 'pause-state', newState !== RhvItemState.Focus);
      }
    }
  }, [size, intersectState]);

  return (
    <div ref={boundInterestRef} {...containerStyles}>
      <div ref={elementRef} {...elementStyles}>
        {element}
      </div>
    </div>
  );
};
