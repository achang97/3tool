import { useUpdateMyUserMutation } from '@app/redux/services/users';
import { LockOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

const commonTextFieldProps: TextFieldProps = {
  InputProps: {
    startAdornment: (
      <InputAdornment position="start">
        <LockOutlined fontSize="small" sx={{ color: 'greyscale.icon.main' }} />
      </InputAdornment>
    ),
  },
  fullWidth: true,
  type: 'password',
};

export const UpdatePassword = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updateMyUser, { isLoading, error }] = useUpdateMyUserMutation();

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value),
    []
  );
  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value),
    []
  );

  const toggleEditMode = useCallback(() => {
    setNewPassword('');
    setConfirmPassword('');
    setIsEditMode((prevIsEditMode) => !prevIsEditMode);
  }, []);

  const isPasswordMatch = useMemo(() => {
    return !newPassword || !confirmPassword || newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const isSaveDisabled = useMemo(() => {
    return !newPassword || !confirmPassword || !isPasswordMatch;
  }, [newPassword, confirmPassword, isPasswordMatch]);

  const handleSave = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await updateMyUser({ password: newPassword }).unwrap();
        setIsEditMode(false);
      } catch {
        /* empty */
      }
    },
    [newPassword, updateMyUser]
  );

  return (
    <Stack spacing={2} data-testid="update-password">
      <Typography variant="subtitle1">Password</Typography>
      <Box>
        {!isEditMode && (
          <Grid container spacing={{ xs: 1, md: 3 }} justifyContent="flex-end">
            <Grid item xs={12} md>
              <TextField {...commonTextFieldProps} value="dummy password" disabled />
            </Grid>
            <Grid item xs="auto">
              <Button color="primary" onClick={toggleEditMode} size="medium">
                Change Password
              </Button>
            </Grid>
          </Grid>
        )}
        {isEditMode && (
          <Grid
            container
            spacing={1}
            justifyContent="flex-end"
            component="form"
            onSubmit={handleSave}
          >
            <Grid container item spacing={1} xs={12} lg>
              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  label="Choose new password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  label="Confirm new password"
                  autoComplete="new-password"
                  error={!isPasswordMatch}
                  helperText={!isPasswordMatch && 'Passwords do not match'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <ApiErrorMessage error={error} />
                </Grid>
              )}
            </Grid>
            <Grid item sx={{ marginLeft: { lg: 2 }, marginTop: { lg: 2.25 } }}>
              <LoadingButton
                type="submit"
                color="primary"
                loading={isLoading}
                disabled={isSaveDisabled}
              >
                Save new password
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </Box>
    </Stack>
  );
};
