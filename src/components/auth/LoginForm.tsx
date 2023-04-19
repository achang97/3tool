import { useLoginMutation } from '@app/redux/services/auth';
import { TextField } from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';
import { AuthContainer } from './common/AuthContainer';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { error, isLoading }] = useLoginMutation();

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleLogin = useCallback(() => {
    login({ email, password });
  }, [email, login, password]);

  return (
    <AuthContainer
      title="Sign in"
      onSubmit={handleLogin}
      error={error}
      SubmitButtonProps={{ loading: isLoading, children: 'Sign in' }}
      testId="login-form"
    >
      <TextField
        type="email"
        label="Email"
        placeholder="Enter email"
        value={email}
        onChange={handleEmailChange}
        required
      />
      <TextField
        type="password"
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
    </AuthContainer>
  );
};
