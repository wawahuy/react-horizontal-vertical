import React from 'react';
import { RhvProvider } from './context';
import { RhvContainer } from './components/RhvContainer';
import './styles.scss';
import { RhvProps, RhvReact } from './interfaces/props';

export { default as ReactFromModule } from 'react';
export * from './interfaces/events';
export * from './interfaces/props';
export * from './components/RhvContainer';
export * from './components/RhvItem';

export const Rhv: React.FC<RhvReact & RhvProps> = ({ children, ...props }) => {
  return (
    <RhvProvider {...props}>
      <RhvContainer>{children}</RhvContainer>
    </RhvProvider>
  );
};
