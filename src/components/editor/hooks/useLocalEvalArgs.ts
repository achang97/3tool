import { useContext } from 'react';
import { LocalEvalArgsContext, LocalEvalArgsState } from '../contexts/LocalEvalArgsContext';

export const useLocalEvalArgs = (): LocalEvalArgsState => {
  return useContext(LocalEvalArgsContext);
};
