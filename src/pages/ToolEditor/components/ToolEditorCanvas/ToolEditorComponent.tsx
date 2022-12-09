import React, {
  forwardRef,
  memo,
  useCallback,
  ForwardedRef,
  ReactNode,
} from 'react';
import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ComponentType } from 'types';

type ToolEditorComponentProps = {
  /* eslint-disable react/no-unused-prop-types */
  componentId: string;
  componentType: ComponentType;
  isDragging: boolean;
  isFocused: boolean;
  className?: string;
  children?: ReactNode;
  /* eslint-enable react/no-unused-prop-types */
};

export const ToolEditorComponent = memo(
  forwardRef(
    (
      /* eslint-disable react/prop-types */
      {
        componentId,
        componentType,
        isDragging,
        isFocused,
        children,
        className,
        ...rest
      }: ToolEditorComponentProps,
      /* eslint-enable react/prop-types */
      ref: ForwardedRef<HTMLDivElement>
    ) => {
      const getComponent = useCallback(() => {
        switch (componentType) {
          case ComponentType.Button:
            return <Button variant="outlined">Button</Button>;
          case ComponentType.Select:
            return (
              <Select MenuProps={{ sx: { display: isDragging ? 'none' : '' } }}>
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
            return <Typography>Test</Typography>;
        }
      }, [componentType, isDragging]);

      return (
        <Box
          ref={ref}
          id={componentId}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className={`${isFocused ? 'react-grid-item-focused' : ''} ${
            isDragging ? 'react-grid-item-dragging' : ''
          } ${className}`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        >
          {getComponent()}
          {children}
        </Box>
      );
    }
  )
);
