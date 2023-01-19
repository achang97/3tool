import { Component } from '@app/types';
import { Button } from '@mui/material';

export type CanvasButtonProps = NonNullable<Component['metadata']['button']>;

export const CanvasButton = ({ basic }: CanvasButtonProps) => {
  return <Button data-testid="canvas-button">{basic.text}</Button>;
};
