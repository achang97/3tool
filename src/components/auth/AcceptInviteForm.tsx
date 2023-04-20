import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { useAcceptInviteMutation } from '@app/redux/services/users';
import { useRouter } from 'next/router';
import { AuthContainer } from './common/AuthContainer';
import { LoginRedirectFooter } from './common/LoginRedirectFooter';

export const AcceptInviteForm = () => {
  const {
    query: { email = '', inviteToken = '' },
  } = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [acceptInvite, { error, isLoading }] = useAcceptInviteMutation();

  const handleFirstNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  }, []);

  const handleLastNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handlePasswordConfirmationChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  }, []);

  const isPasswordMatch = useMemo(() => {
    return !password || !passwordConfirmation || password === passwordConfirmation;
  }, [password, passwordConfirmation]);

  const handleAcceptInvite = useCallback(() => {
    if (!isPasswordMatch) {
      return;
    }

    acceptInvite({
      firstName,
      lastName,
      password,
      inviteToken: inviteToken.toString(),
    });
  }, [acceptInvite, firstName, lastName, password, inviteToken, isPasswordMatch]);

  return (
    <AuthContainer
      title="Create an account"
      subtitle={`You received an invitation at ${email}. Complete your information below to continue.`}
      onSubmit={handleAcceptInvite}
      error={error}
      SubmitButtonProps={{ loading: isLoading, children: 'Continue' }}
      footer={<LoginRedirectFooter />}
      testId="accept-invite-form"
    >
      <Stack direction="row" spacing={1}>
        <TextField
          type="text"
          label="First name"
          placeholder="Enter your first name"
          value={firstName}
          fullWidth
          onChange={handleFirstNameChange}
          required
        />
        <TextField
          type="text"
          label="Last name"
          placeholder="Enter your last name"
          value={lastName}
          fullWidth
          onChange={handleLastNameChange}
          required
        />
      </Stack>
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
