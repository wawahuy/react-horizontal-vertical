import React, { useMemo, useRef, useState } from 'react';
import { RhvItem } from '../RhvItem';
import { genGlobalID } from '../../helpers';
import { RhvItemProps } from '../../interfaces/props';
import { RhvItemState } from '../../interfaces/events';

export interface RhvContainerProps {
  children: React.ReactNode;
}

const genArrayInitiated = (count: number) => {
  return Array.from({ length: count }).map(() => false);
};

export const RhvContainer: React.FC<RhvContainerProps> = ({ children }) => {
  const [isInitiated, setInitiated] = useState<boolean>();
  const hmInitiatedRef = useRef(genArrayInitiated(React.Children.count(children)));

  const handleStateChange = (state: RhvItemState, index: number) => {
    if (state === RhvItemState.Initial) {
      const hm = hmInitiatedRef.current;
      hm[index] = true;
      setInitiated(hm.every((d) => d));
    }
  };

  const elements = useMemo(() => {
    const result = React.Children.map(children, (element, index) => {
      const props: RhvItemProps = {
        element: element as React.ReactElement,
        onStateChange: handleStateChange,
        index
      };
      return <RhvItem key={`rhv-cnt-${genGlobalID()}`} {...props} />;
    });
    return result;
  }, [children]);

  return (
    <div className="rhv-container" style={{ opacity: isInitiated ? 1 : 0 }}>
      {elements}
    </div>
  );
};
