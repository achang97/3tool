import { useLoginMutation } from '@app/redux/services/auth';
import { Button, Stack, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { error }] = useLoginMutation();

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleLogin = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      login({ email, password });
    },
    [email, login, password]
  );

  return (
    <form onSubmit={handleLogin} data-testid="login-form">
      <Stack spacing={1}>
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
        {error && <ApiErrorMessage error={error} />}
        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
};
