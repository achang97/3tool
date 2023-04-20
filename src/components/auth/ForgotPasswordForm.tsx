import { ChangeEvent, useCallback, useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { useForgotPasswordMutation } from '@app/redux/services/auth';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { AuthContainer } from './common/AuthContainer';
import { LoginRedirectFooter } from './common/LoginRedirectFooter';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [submitForgotPassword, { error, isLoading }] = useForgotPasswordMutation();
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmitForgotPassword = useCallback(async () => {
    try {
      await submitForgotPassword({ email }).unwrap();
      enqueueSnackbar(`Sent an email to ${email}`, { variant: 'success' });
    } catch {
      // Do nothing
    }
  }, [submitForgotPassword, email, enqueueSnackbar]);

  return (
    <AuthContainer
      title="Reset your password"
      subtitle="Enter your email to receive a link to reset your password."
      onSubmit={handleSubmitForgotPassword}
      error={error}
      SubmitButtonProps={{ loading: isLoading, children: 'Continue' }}
      footer={<LoginRedirectFooter />}
      testId="forgot-password-form"
    >
      <TextField
        type="email"
        label="Your email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        required
      />
      <Typography variant="body2">
        If you don’t receive an email within a few minutes, please check your spam folder.
      </Typography>
    </AuthContainer>
  );
};
