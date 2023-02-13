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
import { BaseCanvasComponentProps, Component, ComponentType } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { focusComponent } from '@app/redux/features/editorSlice';
import { useIsHovered } from '@app/hooks/useIsHovered';
import { CanvasButton } from './components/CanvasButton';
import { CanvasTextInput } from './components/CanvasTextInput';
import { CanvasText } from './components/CanvasText';
import { CanvasNumberInput } from './components/CanvasNumberInput';
import { CanvasTable } from './components/CanvasTable';
import { useComponentEvalErrors } from '../hooks/useComponentEvalErrors';
import { CanvasComponentHandle } from './CanvasComponentHandle';

type CanvasComponentProps = {
  component: Component;
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
    { component, children, className, ...rest }: CanvasComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();
    const { movingComponentName, focusedComponentName } = useAppSelector(
      (state) => state.editor
    );

    const errors = useComponentEvalErrors(component);
    const { isHovered, onMouseEnter, onMouseLeave } = useIsHovered();

    const isFocused = useMemo(() => {
      return component.name === focusedComponentName;
    }, [component.name, focusedComponentName]);

    const isDragging = useMemo(() => {
      return component.name === movingComponentName;
    }, [component.name, movingComponentName]);

    const getComponent = useCallback(() => {
      const TypedComponent = CANVAS_COMPONENT_MAP[component.type];
      if (!TypedComponent) {
        return null;
      }
      return <TypedComponent name={component.name} />;
    }, [component.name, component.type]);

    const handleClick = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(focusComponent(component.name));
      },
      [component.name, dispatch]
    );

    const isHandleShown = useMemo(() => {
      return isHovered || isFocused || errors.length !== 0;
    }, [errors.length, isHovered, isFocused]);

    const compositeClassName = useMemo(() => {
      const classes = [className];

      if (isFocused) {
        classes.push('react-grid-item-focused');
      }

      if (isDragging) {
        classes.push('react-grid-item-dragging');
      }

      if (errors.length !== 0) {
        classes.push('react-grid-item-error');
      }

      return classes.join(' ');
    }, [className, errors, isDragging, isFocused]);

    return (
      <Box
        ref={ref}
        tabIndex={0}
        className={compositeClassName}
        onClick={handleClick}
        data-testid={component.name}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {getComponent()}
        {children}
        {isHandleShown && (
          <CanvasComponentHandle name={component.name} errors={errors} />
        )}
      </Box>
    );
  }
);
