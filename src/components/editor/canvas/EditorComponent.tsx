import {
  forwardRef,
  useCallback,
  ForwardedRef,
  ReactNode,
  MouseEvent,
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
import { ComponentType } from '@app/types';
import { useAppDispatch } from '@app/redux/hooks';
import { focusComponent } from '@app/redux/features/editorSlice';

type EditorComponentProps = {
  componentId: string;
  componentType: ComponentType;
  isDragging: boolean;
  isFocused: boolean;
  className?: string;
  children?: ReactNode;
};

export const EditorComponent = forwardRef(
  (
    {
      componentId,
      componentType,
      isDragging,
      isFocused,
      children,
      className,
      ...rest
    }: EditorComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();

    const getComponent = useCallback(() => {
      switch (componentType) {
        case ComponentType.Button:
          return (
            <Button variant="outlined" onClick={() => console.log('clicked')}>
              Button
            </Button>
          );
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

    const handleClick = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(focusComponent(componentId));
      },
      [dispatch, componentId]
    );

    return (
      <Box
        ref={ref}
        id={componentId}
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
