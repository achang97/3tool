import { useContext } from 'react';
import { LocalEvalArgsContext, LocalEvalArgsState } from '../contexts/LocalEvalArgsContext';

export const useLocalEvalArgs = (): LocalEvalArgsState['args'] => {
  const { args } = useContext(LocalEvalArgsContext);
  return args;
};
