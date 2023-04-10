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
import { useComponentEventHandlerCallbacks } from '../hooks/useComponentEventHandlerCallbacks';

type CanvasComponentProps = {
  component: Component;
  isEditable: boolean;
  className?: string;
  children?: ReactNode;
};

const CANVAS_COMPONENT_MAP: Record<ComponentType, FC<BaseCanvasComponentProps>> = {
  [ComponentType.Button]: CanvasButton,
  [ComponentType.TextInput]: CanvasTextInput,
  [ComponentType.NumberInput]: CanvasNumberInput,
  [ComponentType.Text]: CanvasText,
  [ComponentType.Table]: CanvasTable,
};

export const CanvasComponent = forwardRef(
  (
    { component, isEditable, children, className, ...rest }: CanvasComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();
    const { movingComponentName, focusedComponentName } = useAppSelector((state) => state.editor);
    const eventHandlerCallbacks = useComponentEventHandlerCallbacks(component.eventHandlers);

    const errors = useComponentEvalErrors(component);
    const { isHovered, onMouseEnter, onMouseLeave } = useIsHovered();

    const isFocused = useMemo(() => {
      return component.name === focusedComponentName;
    }, [component.name, focusedComponentName]);

    const isDragging = useMemo(() => {
      return component.name === movingComponentName;
    }, [component.name, movingComponentName]);

    const typedComponent = useMemo(() => {
      const TypedComponent = CANVAS_COMPONENT_MAP[component.type];
      return <TypedComponent name={component.name} eventHandlerCallbacks={eventHandlerCallbacks} />;
    }, [component.name, component.type, eventHandlerCallbacks]);

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
      if (!isEditable) {
        return className;
      }

      const classes = [className];
      if (isFocused) {
        classes.push('react-grid-item-focused');
      }
      if (isHovered) {
        classes.push('react-grid-item-hovered');
      }
      if (isDragging) {
        classes.push('react-grid-item-dragging');
      }
      if (errors.length !== 0) {
        classes.push('react-grid-item-error');
      }
      return classes.join(' ');
    }, [className, errors.length, isDragging, isEditable, isFocused, isHovered]);

    return (
      <Box
        ref={ref}
        tabIndex={0}
        className={compositeClassName}
        onClick={handleClick}
        data-testid={`canvas-component-${component.name}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {typedComponent}
        {isEditable && (
          <>
            {children}
            {isHandleShown && <CanvasComponentHandle name={component.name} errors={errors} />}
          </>
        )}
      </Box>
    );
  }
);
