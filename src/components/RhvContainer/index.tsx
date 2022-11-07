import React, { useEffect, useMemo, useState } from 'react';
import { useRhvContext } from '../../context';
import { RhvItem, RhvItemProps } from '../RhvItem';
import { genGlobalID } from '../../helpers';

export interface RhvContainerProps {
  children: React.ReactNode;
}

export const RhvContainer: React.FC<RhvContainerProps> = ({ children }) => {
  const [state, dispatch] = useRhvContext();
  const [elements, setElements] = useState<RhvItemProps[]>([]);

  useEffect(() => {
    const list: RhvItemProps[] = [];
    React.Children.map(children, (element, index) => {
      list.push({
        element: element as React.ReactElement,
        index
      });
    });
    setElements(list);
  }, []);

  const render = useMemo(() => {
    return elements.map((element) => {
      // eslint-disable-next-line react/jsx-key
      return <RhvItem key={`rhv-cnt-${genGlobalID()}`} {...element} />;
    });
  }, [elements]);

  return <div className="rhv-container">{render}</div>;
};
