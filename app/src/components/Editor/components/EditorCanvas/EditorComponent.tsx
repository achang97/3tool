import React, {
  forwardRef,
  memo,
  useCallback,
  ForwardedRef,
  ReactNode,
  useMemo,
} from 'react';
import {
  Button,
  Input,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ComponentType } from 'types';

type EditorComponentProps = {
  /* eslint-disable react/no-unused-prop-types */
  componentType: ComponentType;
  isDragging: boolean;
  lastClickedLocation?: [number, number];
  className?: string;
  children?: ReactNode;
  /* eslint-enable react/no-unused-prop-types */
};

export const EditorComponent = memo(
  forwardRef(
    (
      /* eslint-disable react/prop-types */
      {
        componentType,
        isDragging,
        lastClickedLocation,
        children,
        className,
        ...rest
      }: EditorComponentProps,
      /* eslint-enable react/prop-types */
      ref: ForwardedRef<HTMLDivElement>
    ) => {
      // @ts-ignore current should be defined
      const boundingClientRect = ref?.current?.getBoundingClientRect();

      // @ts-ignore current should be defined
      const isRefFocused = document.activeElement === ref.current;

      const getComponent = useCallback(() => {
        switch (componentType) {
          case ComponentType.Button:
            return <Button variant="outlined">Button</Button>;
          case ComponentType.Select:
            return (
              <Select>
                <MenuItem value="option-1">Option 1</MenuItem>
              </Select>
            );
          case ComponentType.TextInput:
            return <Input type="text" placeholder="Text Input" />;
          case ComponentType.Table:
            return (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Table Col 1</TableCell>
                    <TableCell>Table Col 2</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Val 1</TableCell>
                    <TableCell>Val 2</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          default:
            return <div>Test</div>;
        }
      }, [componentType]);

      const isClickFocused = useMemo(() => {
        if (!lastClickedLocation || !boundingClientRect) {
          return false;
        }

        const [x, y] = lastClickedLocation;
        const { top, bottom, left, right } = boundingClientRect as DOMRect;

        return top <= y && y <= bottom && left <= x && x <= right;
      }, [lastClickedLocation, boundingClientRect]);

      const isFocused = useMemo(
        () => isClickFocused || isRefFocused,
        [isClickFocused, isRefFocused]
      );

      return (
        /* eslint-disable react/jsx-props-no-spreading, jsx-a11y/no-noninteractive-tabindex */
        <div
          ref={ref}
          tabIndex={0}
          className={`${isFocused ? 'react-grid-item-focused' : ''} ${
            isDragging ? 'react-grid-item-dragging' : ''
          } ${className}`}
          {...rest}
        >
          {getComponent()}
          {children}
        </div>
        /* eslint-disable react/jsx-props-no-spreading, jsx-a11y/no-noninteractive-tabindex */
      );
    }
  )
);
