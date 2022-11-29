import React, {
  createContext,
  memo,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { ComponentType } from 'types';

export type NewComponentDrag = {
  isDraggingNew: boolean;
  setIsDraggingNew: (isDraggingNew: boolean) => void;
  componentType?: ComponentType;
  setComponentType: (componentType?: ComponentType) => void;
};

type NewComponentDragProviderProps = {
  children: ReactNode;
};

const DEFAULT_VALUE: NewComponentDrag = {
  isDraggingNew: false,
  setIsDraggingNew: () => {},
  setComponentType: () => {},
};

const NewComponentDragContext = createContext<NewComponentDrag>(DEFAULT_VALUE);

const NewComponentDragProvider = memo(
  ({ children }: NewComponentDragProviderProps) => {
    const [componentType, setComponentType] = useState<ComponentType>();
    const [isDraggingNew, setIsDraggingNew] = useState(false);

    const value = useMemo(
      () => ({
        componentType,
        setComponentType,
        isDraggingNew,
        setIsDraggingNew,
      }),
      [componentType, setComponentType, isDraggingNew, setIsDraggingNew]
    );

    return (
      <NewComponentDragContext.Provider value={value}>
        {children}
      </NewComponentDragContext.Provider>
    );
  }
);

export { NewComponentDragContext, NewComponentDragProvider };
