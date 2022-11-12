import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useRhvContext } from '../../context';
import { RhvItemProps } from '../../interfaces/props';
import { RhvItemState } from '../../interfaces/events';
import { logD, nameEnum, updateAttribute } from '../../helpers';
import { useSize } from '../../hooks/use-size';
import { useIntersect } from '../../hooks/use-intersect';

export const RhvItem: React.FC<RhvItemProps> = ({ element, index, onStateChange }) => {
  const itemStateRef = useRef<RhvItemState>(RhvItemState.None);
  const boundInterestRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [state] = useRhvContext();
  const [size] = useSize(elementRef);
  const [intersectState] = useIntersect(
    (state) => {
      // the previous value is initially 0 so the direction cannot be calculated
      if (itemStateRef.current <= RhvItemState.None) {
        if (index % 2 === 0) {
          state.directionInterestRatio = 'decrease';
        } else {
          state.directionInterestRatio = 'increase';
        }
        state.directionScrollY = 'down';
      }
      // logD('intersect', index, state);
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

  const { itemState, ...elementStyles } = useMemo(() => {
    // because useIntersect and useSize register event after render
    if (!intersectState || !size) {
      return {};
    }

    const classes: string[] = [];
    const style: React.CSSProperties = {};
    const windowHeight = window.innerHeight;
    const { directionInterestRatio, directionScrollY, intersectRatio, isIntersecting } =
      intersectState;
    const { width, height } = size;
    const left = height * intersectRatio;
    const leftPercent = (1 - left / windowHeight) * 100;

    // update item state
    let itemState = itemStateRef.current;
    const leftError = 0.5;
    if (left >= leftError) {
      if (isIntersecting && left >= windowHeight - leftError) {
        itemState = RhvItemState.Focus;
      } else {
        itemState = RhvItemState.Enter;
      }
    } else {
      itemState = RhvItemState.Leave;
    }

    // update styles
    if (itemState === RhvItemState.Enter) {
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
      style,
      itemState
    };
  }, [size, intersectState]);

  useLayoutEffect(() => {
    if (!itemState) {
      return;
    }

    // emit initial
    if (itemStateRef.current === RhvItemState.None) {
      logD('Item', index, nameEnum(RhvItemState)[RhvItemState.Initial]);
      emitEvent(RhvItemState.Initial);
    }

    // emit
    logD('Item', index, nameEnum(RhvItemState)[itemState]);
    emitEvent(itemState);

    // pause/play animation
    const element = elementRef.current;
    if (element && state.pauseAnimation) {
      logD('Animation', index, itemState !== RhvItemState.Focus);
      updateAttribute(element, 'pause-state', itemState !== RhvItemState.Focus);
    }

    // save previous itemState
    itemStateRef.current = itemState;
  }, [itemState]);

  const containerStyles = useMemo(() => {
    const classes: string[] = ['rhv-item-wrapper'];
    const style: React.CSSProperties = {};
    const height = size?.height || 0;

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
