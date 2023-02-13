import { ErrorOutline } from '@mui/icons-material';
import { Box, SxProps, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { ComponentEvalError } from '../hooks/useComponentEvalErrors';

type CanvasComponentHandleProps = {
  name: string;
  errors: ComponentEvalError[];
};

export const CANVAS_COMPONENT_HANDLE_CLASSNAME = 'canvas-component-handle';

export const CanvasComponentHandle = ({
  name,
  errors,
}: CanvasComponentHandleProps) => {
  const errorProps: SxProps = useMemo(() => {
    if (errors.length === 0) {
      return {};
    }

    return {
      backgroundColor: 'error.light',
      color: 'error.contrastText',
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        position: 'absolute',
        bottom: '100%',
        left: 0,
        fontSize: '.7rem',
        padding: 0.25,
        marginBottom: 0.25,
        borderRadius: '2px',
        cursor: 'default',
        ...errorProps,
      }}
      className={CANVAS_COMPONENT_HANDLE_CLASSNAME}
      data-testid="canvas-component-handle"
    >
      {name}
      {errorMessage && (
        <Tooltip title={errorMessage} placement="top">
          <ErrorOutline
            data-testid="canvas-component-handle-error-icon"
            fontSize="inherit"
          />
        </Tooltip>
      )}
    </Box>
  );
};
