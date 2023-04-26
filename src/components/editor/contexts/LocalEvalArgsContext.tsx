import React, { createContext, ReactNode, useMemo } from 'react';

const DEFAULT_STATE = {
  args: {},
};

export type LocalEvalArgsState = {
  args: Record<string, any>;
  error?: string;
};

export const LocalEvalArgsContext = createContext<LocalEvalArgsState>(DEFAULT_STATE);

type LocalEvalArgsProviderProps = {
  args: Record<string, any>;
  error?: string;
  children?: ReactNode;
};

export const LocalEvalArgsProvider = ({ children, args, error }: LocalEvalArgsProviderProps) => {
  const contextValue = useMemo(() => {
    return { args, error };
  }, [args, error]);

  return (
    <LocalEvalArgsContext.Provider value={contextValue}>{children}</LocalEvalArgsContext.Provider>
  );
};
