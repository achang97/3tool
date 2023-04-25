import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { useUpdateMyUserMutation } from '@app/redux/services/users';
import { EmailOutlined, PersonOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, InputAdornment, Stack, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

export const UpdateUserName = () => {
  const user = useSignedInUser();
  const defaultFirstName = useMemo(() => user?.firstName ?? '', [user?.firstName]);
  const defaultLastName = useMemo(() => user?.lastName ?? '', [user?.lastName]);

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);

  const [updateMyUser, { isLoading, error }] = useUpdateMyUserMutation();

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value),
    []
  );
  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value),
    []
  );

  const handleRestore = useCallback(() => {
    setFirstName(defaultFirstName);
    setLastName(defaultLastName);
  }, [defaultFirstName, defaultLastName]);

  const handleSave = useCallback(() => {
    updateMyUser({ firstName, lastName });
  }, [firstName, lastName, updateMyUser]);

  const showActionButtons = useMemo(
    () => defaultFirstName !== firstName || defaultLastName !== lastName,
    [firstName, lastName, defaultFirstName, defaultLastName]
  );

  return (
    <Grid container spacing={1} data-testid="update-user-name">
      <Grid item xs={12} md={6}>
        <TextField
          label="First name"
          autoComplete="given-name"
          fullWidth
          value={firstName}
          onChange={handleFirstNameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline fontSize="small" sx={{ color: 'greyscale.icon.main' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Last name"
          autoComplete="family-name"
          fullWidth
          value={lastName}
          onChange={handleLastNameChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={user?.email}
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined fontSize="small" sx={{ color: 'greyscale.icon.main' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {showActionButtons && (
        <Grid item xs={12}>
          {error && <ApiErrorMessage error={error} />}
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }} spacing={1}>
            <Button color="secondary" onClick={handleRestore}>
              Restore
            </Button>
            <LoadingButton color="primary" onClick={handleSave} loading={isLoading}>
              Save changes
            </LoadingButton>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};
