import React, { useMemo } from 'react';
// import { useRhvContext } from '../../context';
import { RhvItem } from '../RhvItem';
import { genGlobalID } from '../../helpers';
import { RhvItemProps } from '../../interfaces/props';

export interface RhvContainerProps {
  children: React.ReactNode;
}

export const RhvContainer: React.FC<RhvContainerProps> = ({ children }) => {
  // const [state, dispatch] = useRhvContext();
  const elements = useMemo(() => {
    const result = React.Children.map(children, (element, index) => {
      const props: RhvItemProps = {
        element: element as React.ReactElement,
        index
      };
      return <RhvItem key={`rhv-cnt-${genGlobalID()}`} {...props} />;
    });
    return result;
  }, [children]);

  return <div className="rhv-container">{elements}</div>;
};
