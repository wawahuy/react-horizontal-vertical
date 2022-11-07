import React from 'react';

interface RhvState {
  test: number;
}

const initState: RhvState = {
  test: 0
};

type RhvAction = { type: 'test' };

const RhvStateContext = React.createContext<RhvState>(initState);
const RhvDispatchContext = React.createContext<React.Dispatch<RhvAction> | undefined>(undefined);

const rhvReducer = (state: RhvState, action: RhvAction) => {
  switch (action.type) {
    case 'test':
      return { ...state, test: ++state.test };
  }
  return state;
};

export const useRhvContext = (): [RhvState, React.Dispatch<RhvAction>] => {
  const state = React.useContext(RhvStateContext);
  const dispatch = React.useContext(RhvDispatchContext) as React.Dispatch<RhvAction>;
  return [state, dispatch];
};

export const RhvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(rhvReducer, initState);
  return (
    <RhvStateContext.Provider value={state}>
      <RhvDispatchContext.Provider value={dispatch}>{children}</RhvDispatchContext.Provider>
    </RhvStateContext.Provider>
  );
};
