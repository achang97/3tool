import {
  forwardRef,
  useCallback,
  ForwardedRef,
  ReactNode,
  MouseEvent,
} from 'react';
import { Box, Typography } from '@mui/material';
import { Component, ComponentType } from '@app/types';
import { useAppDispatch } from '@app/redux/hooks';
import { focusComponent } from '@app/redux/features/editorSlice';
import { CanvasButton } from './CanvasButton';

type CanvasComponentProps = {
  name: string;
  type: ComponentType;
  metadata: Component['metadata'];
  isDragging: boolean;
  isFocused: boolean;
  className?: string;
  children?: ReactNode;
};

export const CanvasComponent = forwardRef(
  (
    {
      name,
      type,
      metadata,
      isDragging,
      isFocused,
      children,
      className,
      ...rest
    }: CanvasComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();

    const getComponent = useCallback(() => {
      switch (type) {
        case ComponentType.Button:
          return <CanvasButton {...metadata.button!} />;
        default:
          return <Typography>TODO</Typography>;
      }
    }, [type, metadata]);

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
        id={name}
        tabIndex={0}
        className={`${isFocused ? 'react-grid-item-focused' : ''} ${
          isDragging ? 'react-grid-item-dragging' : ''
        } ${className}`}
        onClick={handleClick}
        {...rest}
      >
        {getComponent()}
        {children}
      </Box>
    );
  }
);
