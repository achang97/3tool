import { useContext } from 'react';
import {
  ActionQueueContext,
  ActionQueueState,
} from '../contexts/ActionQueueContext';

export const useActionQueue = (): ActionQueueState => {
  return useContext(ActionQueueContext);
};
