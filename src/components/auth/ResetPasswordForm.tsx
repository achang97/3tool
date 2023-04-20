import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useApplyForgotPasswordMutation } from '@app/redux/services/auth';
import { AuthContainer } from './common/AuthContainer';

export const ResetPasswordForm = () => {
  const {
    query: { forgotPasswordToken = '' },
  } = useRouter();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [applyForgotPassword, { error, isLoading }] = useApplyForgotPasswordMutation();

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handlePasswordConfirmationChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  }, []);

  const isPasswordMatch = useMemo(() => {
    return !password || !passwordConfirmation || password === passwordConfirmation;
  }, [password, passwordConfirmation]);

  const handleApplyForgotPassword = useCallback(() => {
    if (!isPasswordMatch) {
      return;
    }

    applyForgotPassword({
      password,
      forgotPasswordToken: forgotPasswordToken.toString(),
    });
  }, [applyForgotPassword, password, forgotPasswordToken, isPasswordMatch]);

  return (
    <AuthContainer
      title="Set your new password"
      onSubmit={handleApplyForgotPassword}
      error={error}
      SubmitButtonProps={{ loading: isLoading, children: 'Set password' }}
      testId="reset-password-form"
    >
      <TextField
        type="password"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <TextField
        type="password"
        label="Password confirmation"
        placeholder="Confirm your password"
        error={!isPasswordMatch}
        helperText={!isPasswordMatch && 'Passwords do not match'}
        value={passwordConfirmation}
        onChange={handlePasswordConfirmationChange}
        required
      />
    </AuthContainer>
  );
};
