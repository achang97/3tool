import React, {
  forwardRef,
  useCallback,
  ForwardedRef,
  ReactNode,
  MouseEvent,
  FC,
  useMemo,
} from 'react';
import { Box } from '@mui/material';
import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { focusComponent } from '@app/redux/features/editorSlice';
import { CanvasButton } from './components/CanvasButton';
import { CanvasTextInput } from './components/CanvasTextInput';
import { CanvasText } from './components/CanvasText';
import { CanvasNumberInput } from './components/CanvasNumberInput';
import { CanvasTable } from './components/CanvasTable';

type CanvasComponentProps = {
  name: string;
  type: ComponentType;
  className?: string;
  children?: ReactNode;
};

const CANVAS_COMPONENT_MAP: Record<
  ComponentType,
  FC<BaseCanvasComponentProps>
> = {
  [ComponentType.Button]: CanvasButton,
  [ComponentType.TextInput]: CanvasTextInput,
  [ComponentType.NumberInput]: CanvasNumberInput,
  [ComponentType.Text]: CanvasText,
  [ComponentType.Table]: CanvasTable,
};

export const CanvasComponent = forwardRef(
  (
    { name, type, children, className, ...rest }: CanvasComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();

    const { movingComponentName, focusedComponentName } = useAppSelector(
      (state) => state.editor
    );

    const isFocused = useMemo(() => {
      return name === focusedComponentName;
    }, [focusedComponentName, name]);

    const isDragging = useMemo(() => {
      return name === movingComponentName;
    }, [movingComponentName, name]);

    const getComponent = useCallback(() => {
      const Component = CANVAS_COMPONENT_MAP[type];
      if (!Component) {
        return null;
      }
      return <Component name={name} />;
    }, [name, type]);

    const handleClick = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(focusComponent(name));
      },
      [dispatch, name]
    );

    return (
      <Box
        ref={ref}
        tabIndex={0}
        className={`${isFocused ? 'react-grid-item-focused' : ''} ${
          isDragging ? 'react-grid-item-dragging' : ''
        } ${className}`}
        onClick={handleClick}
        data-testid={name}
        {...rest}
      >
        {getComponent()}
        {children}
      </Box>
    );
  }
);
