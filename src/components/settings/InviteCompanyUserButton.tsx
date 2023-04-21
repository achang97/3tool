import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { Add, EmailOutlined, PersonOutline } from '@mui/icons-material';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { useSendCompanyInviteMutation } from '@app/redux/services/companies';
import { Role } from './utils/types';
import { UserRoleSelect } from './UserRoleSelect';
import { getUserRolesFlags } from './utils/userRoleConversion';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

const DEFAULT_ROLE = Role.Editor;

export const InviteCompanyUserButton = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [sendCompanyInvite, { isLoading, error, reset }] = useSendCompanyInviteMutation();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState(DEFAULT_ROLE);

  const openInviteDialog = () => {
    setEmail('');
    setRole(DEFAULT_ROLE);
    reset();
    setIsInviteDialogOpen(true);
  };
  const closeInviteDialog = () => {
    setIsInviteDialogOpen(false);
  };

  const handleSendInviteClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendCompanyInvite({ email, roles: getUserRolesFlags(role) }).unwrap();
      closeInviteDialog();
      enqueueSnackbar(`Invited ${email}`, { variant: 'success' });
    } catch {
      /* empty */
    }
  };

  return (
    <>
      <Button
        onClick={openInviteDialog}
        size="small"
        variant="text"
        startIcon={<Add fontSize="inherit" />}
        sx={{ marginTop: 0.25 }}
      >
        Invite user
      </Button>

      <Dialog
        onClose={closeInviteDialog}
        open={isInviteDialogOpen}
        fullWidth
        aria-labelledby="InviteCompanyUser-dialog-title"
        aria-describedby="InviteCompanyUser-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle id="InviteCompanyUser-dialog-title">Invite new user</DialogTitle>

        <form onSubmit={handleSendInviteClick}>
          <DialogContent>
            <Stack spacing={1.25}>
              <Typography variant="body2" id="InviteCompanyUser-dialog-description">
                The user will receive an email to register and join the team workspace.
              </Typography>
              <TextField
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="User email"
                placeholder="Enter email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" sx={{ color: 'greyscale.icon.main' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl>
                <InputLabel id="InviteCompanyUser-UserRoleSelect-label">User role</InputLabel>
                <UserRoleSelect
                  labelId="InviteCompanyUser-UserRoleSelect-label"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  fullWidth
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" sx={{ color: 'greyscale.icon.main' }} />
                    </InputAdornment>
                  }
                />
              </FormControl>
              {error && <ApiErrorMessage error={error} />}
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton type="submit" loading={isLoading} disabled={!email} fullWidth>
              Send invite
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
