import React, { createContext, ReactNode, useMemo } from 'react';

const DEFAULT_STATE = {
  args: {},
};

export type LocalEvalArgsState = {
  args: Record<string, any>;
};

export const LocalEvalArgsContext = createContext<LocalEvalArgsState>(DEFAULT_STATE);

type LocalEvalArgsProviderProps = {
  args: Record<string, any>;
  children?: ReactNode;
};

export const LocalEvalArgsProvider = ({ children, args }: LocalEvalArgsProviderProps) => {
  const contextValue = useMemo(() => {
    return { args };
  }, [args]);

  return (
    <LocalEvalArgsContext.Provider value={contextValue}>{children}</LocalEvalArgsContext.Provider>
  );
};
