import { ApiError } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { Typography, TypographyProps } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { ForwardedRef, forwardRef, useMemo } from 'react';

type ApiErrorMessageProps = {
  error: ApiError | SerializedError;
  sx?: TypographyProps['sx'];
};

export const ApiErrorMessage = forwardRef(
  ({ error, sx }: ApiErrorMessageProps, ref: ForwardedRef<HTMLSpanElement>) => {
    const errorMessage = useMemo(() => {
      return parseApiError(error);
    }, [error]);

    return (
      <Typography ref={ref} color="error" variant="body2" sx={{ textAlign: 'center', ...sx }}>
        {errorMessage}
      </Typography>
    );
  }
);
