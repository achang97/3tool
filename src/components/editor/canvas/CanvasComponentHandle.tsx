import { DragIndicator, ErrorOutline } from '@mui/icons-material';
import { Box, Stack, SxProps, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { lineClamp } from '@app/utils/mui';
import { ComponentEvalError } from '../hooks/useComponentEvalErrors';

type CanvasComponentHandleProps = {
  name: string;
  errors: ComponentEvalError[];
};

export const CanvasComponentHandle = ({ name, errors }: CanvasComponentHandleProps) => {
  const colorProps: SxProps = useMemo(() => {
    if (errors.length !== 0) {
      return {
        backgroundColor: 'error.light',
        color: 'error.contrastText',
      };
    }

    return {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
    };
  }, [errors]);

  const errorMessage = useMemo(() => {
    if (errors.length === 0) {
      return '';
    }

    const activeError = errors[0];
    return `${activeError.name}: ${activeError.error.message}`;
  }, [errors]);

  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{
        maxWidth: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: '100%',
        left: 0,
        fontSize: '.7rem',
        padding: 0.25,
        borderRadius: '2px',
        cursor: 'move',
        ...colorProps,
      }}
      data-testid="canvas-component-handle"
    >
      <DragIndicator fontSize="inherit" />
      <Box sx={{ ...lineClamp(1), display: 'block' }}>{name}</Box>
      {errorMessage && (
        <Tooltip title={errorMessage} placement="top">
          <ErrorOutline data-testid="canvas-component-handle-error-icon" fontSize="inherit" />
        </Tooltip>
      )}
    </Stack>
  );
};
