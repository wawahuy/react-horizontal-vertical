import React from 'react';
import { RhvEvent } from './events';

export interface RhvReact {
  children: React.ReactNode;
}

export interface RhvProps extends RhvEvent {
  thresholdCount: number;
}

export interface RhvItemProps {
  element: React.ReactElement;
  index: number;
}
