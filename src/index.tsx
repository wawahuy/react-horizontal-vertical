import React from 'react';
import { RhvProvider } from './context';
import { RhvContainer } from './components/RhvContainer';
import './styles.scss';

export { default as ReactFromModule } from 'react';

export interface RhvProps {
  children: React.ReactNode;
}

export const Rhv: React.FC<RhvProps> = ({ children }) => {
  return (
    <RhvProvider>
      <RhvContainer>{children}</RhvContainer>
    </RhvProvider>
  );
};
