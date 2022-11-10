import React from 'react';
import { RhvReact } from './interfaces/props';
import { RhvEvent } from './interfaces/events';

interface RhvState extends RhvEvent {
  thresholdCount: number;
  rootElement?: Element;
  pauseAnimation?: boolean;
}

const initState: RhvState = {
  thresholdCount: 500,
  pauseAnimation: true
};

type RhvAction = ({ type: 'init' } & Partial<RhvState>) | { type: 'test' };

const RhvStateContext = React.createContext<RhvState>(initState);
const RhvDispatchContext = React.createContext<React.Dispatch<RhvAction> | undefined>(undefined);

const rhvReducer = (state: RhvState, action: RhvAction) => {
  const { type, ...data } = action;
  switch (type) {
    case 'init':
      return { ...state, ...data };
  }
  return state;
};

export const useRhvContext = (): [RhvState, React.Dispatch<RhvAction>] => {
  const state = React.useContext(RhvStateContext);
  const dispatch = React.useContext(RhvDispatchContext) as React.Dispatch<RhvAction>;
  return [state, dispatch];
};

export const RhvProvider: React.FC<RhvReact & RhvState> = ({ children, ...data }) => {
  const combineState = Object.assign(initState, data);
  const [state, dispatch] = React.useReducer(rhvReducer, combineState);
  return (
    <RhvStateContext.Provider value={state}>
      <RhvDispatchContext.Provider value={dispatch}>{children}</RhvDispatchContext.Provider>
    </RhvStateContext.Provider>
  );
};
