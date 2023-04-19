import { ApiErrorResponse } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { Typography, TypographyProps } from '@mui/material';
import { ForwardedRef, forwardRef, useMemo } from 'react';

type ApiErrorMessageProps = {
  error: ApiErrorResponse['error'];
  variant?: TypographyProps['variant'];
  sx?: TypographyProps['sx'];
};

export const ApiErrorMessage = forwardRef(
  ({ error, variant = 'body2', sx }: ApiErrorMessageProps, ref: ForwardedRef<HTMLSpanElement>) => {
    const errorMessage = useMemo(() => {
      return parseApiError(error);
    }, [error]);

    return (
      <Typography ref={ref} color="error" variant={variant} sx={{ textAlign: 'center', ...sx }}>
        {errorMessage}
      </Typography>
    );
  }
);
