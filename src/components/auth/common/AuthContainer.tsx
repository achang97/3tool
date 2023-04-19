import { Box, Stack, Typography } from '@mui/material';
import { FormEvent, ReactNode, useCallback } from 'react';
import Image from 'next/image';
import logo from '@app/resources/images/logo.svg';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { ApiErrorResponse } from '@app/types';
import { ApiErrorMessage } from '@app/components/common/ApiErrorMessage';

type AuthContainerProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  SubmitButtonProps: LoadingButtonProps;
  onSubmit: () => void;
  error?: ApiErrorResponse['error'];
  footer?: ReactNode;
  testId?: string;
};

export const AuthContainer = ({
  title,
  subtitle,
  children,
  SubmitButtonProps,
  onSubmit,
  error,
  footer,
  testId,
}: AuthContainerProps) => {
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <Stack
      sx={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'greyscale.offwhite.main',
      }}
      data-testid={testId}
    >
      <Stack
        sx={{
          padding: 10,
          width: 575,
          maxWidth: '100%',
          borderRadius: 1,
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Image src={logo} alt="Elixir logo" style={{ height: '40px' }} />
        <Stack sx={{ marginTop: 4, marginBottom: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">{subtitle}</Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1} sx={{ marginBottom: 2 }}>
            {children}
          </Stack>
          {error && <ApiErrorMessage error={error} />}
          <LoadingButton
            type="submit"
            fullWidth
            {...SubmitButtonProps}
            sx={{ marginTop: 2, ...SubmitButtonProps.sx }}
          />
        </form>
        {footer && <Box sx={{ marginTop: 4 }}>{footer}</Box>}
      </Stack>
    </Stack>
  );
};
