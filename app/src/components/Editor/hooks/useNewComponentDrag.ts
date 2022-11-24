import { useContext } from 'react';
import {
  NewComponentDrag,
  NewComponentDragContext,
} from '../contexts/NewComponentDragContext';

export const useNewComponentDrag = (): NewComponentDrag => {
  const value = useContext(NewComponentDragContext);
  return value;
};
