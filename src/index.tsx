import React, { useEffect, useState } from 'react';
import { RhvProvider } from './context';

export { default as ReactFromModule } from 'react';

export interface RhvProps {
  children: React.ReactNode;
}

export const Rhv: React.FC<RhvProps> = ({ children }) => {
  return <RhvProvider>{children}</RhvProvider>;
};
