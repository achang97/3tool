import { useContext } from 'react';
import { ActiveToolContext, ActiveToolState } from '../contexts/ActiveToolContext';

export const useActiveTool = (): ActiveToolState => {
  return useContext(ActiveToolContext);
};
