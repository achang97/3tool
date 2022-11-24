import React, {
  createContext,
  memo,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { ComponentType } from 'types';

export type NewComponentDrag = {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  componentType?: ComponentType;
  setComponentType: (componentType?: ComponentType) => void;
};

type NewComponentDragProviderProps = {
  children: ReactNode;
};

const DEFAULT_VALUE: NewComponentDrag = {
  isDragging: false,
  setIsDragging: () => {},
  setComponentType: () => {},
};

const NewComponentDragContext = createContext<NewComponentDrag>(DEFAULT_VALUE);

const NewComponentDragProvider = memo(
  ({ children }: NewComponentDragProviderProps) => {
    const [componentType, setComponentType] = useState<ComponentType>();
    const [isDragging, setIsDragging] = useState(false);

    const value = useMemo(
      () => ({
        componentType,
        setComponentType,
        isDragging,
        setIsDragging,
      }),
      [componentType, setComponentType, isDragging, setIsDragging]
    );

    return (
      <NewComponentDragContext.Provider value={value}>
        {children}
      </NewComponentDragContext.Provider>
    );
  }
);

export { NewComponentDragContext, NewComponentDragProvider };
