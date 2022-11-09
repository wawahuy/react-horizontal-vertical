import React from 'react';
import { RhvEvent } from './events';

export interface RhvReact {
  children: React.ReactNode;
}

export interface RhvProps extends RhvEvent {
  // Intersect Threshold. Default: 400
  // need: update
  thresholdCount: number;

  // Scroll Container. Default 'body'
  rootElement?: Element;

  // Pause element when ...
  // need: update
  pauseAnimation?: boolean;
}

export interface RhvItemProps {
  // Component after inject and render
  element: React.ReactElement;

  // Position item in container
  index: number;
}
