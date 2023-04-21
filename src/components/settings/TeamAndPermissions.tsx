import React, { useMemo } from 'react';
import { Stack, Typography, SelectChangeEvent } from '@mui/material';
import {
  useGetCompanyUsersQuery,
  useUpdateCompanyUserMutation,
  useGetPendingCompanyInvitesQuery,
} from '@app/redux/services/companies';
import { User } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { useUser } from '@app/hooks/useUser';
import { UserAvatar } from '../common/UserAvatar';
import { Role } from './utils/types';
import { UserRoleSelect } from './UserRoleSelect';
import { getUserRolesFlags, getUserRole } from './utils/userRoleConversion';
import { TeamMemberRow } from './TeamMemberRow';
import { FullscreenLoader } from '../common/FullscreenLoader';

export const TeamAndPermissions = () => {
  const signedInUser = useUser();
  const isSignedInUserAdmin = signedInUser?.roles.isAdmin;

  const getCompanyUsersQuery = useGetCompanyUsersQuery();
  const getPendingCompanyInvitesQuery = useGetPendingCompanyInvitesQuery(undefined, {
    skip: !isSignedInUserAdmin,
  });

  const [updateCompanyUser] = useUpdateCompanyUserMutation();

  const enqueueSnackbar = useEnqueueSnackbar();

  const handleRoleChange = async (e: SelectChangeEvent<Role>, user: User) => {
    const roles = getUserRolesFlags(e.target.value as Role);
    try {
      await updateCompanyUser({ _id: user._id, roles }).unwrap();
      enqueueSnackbar('Role updated', { variant: 'success' });
    } catch (updateError: any) {
      enqueueSnackbar(parseApiError(updateError), { variant: 'error' });
    }
  };

  const errorMessage = useMemo(() => {
    if (getCompanyUsersQuery.isError) {
      return 'Oops! It seems that the user list was not properly loaded. Please, reload the page.';
    }

    if (getPendingCompanyInvitesQuery.isError) {
      return 'Oops! It seems that the invite list was not properly loaded. Please, reload the page.';
    }

    return '';
  }, [getPendingCompanyInvitesQuery.isError, getCompanyUsersQuery.isError]);

  if (getCompanyUsersQuery.isLoading || getPendingCompanyInvitesQuery.isLoading)
    return <FullscreenLoader />;

  if (errorMessage)
    return (
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      </Stack>
    );

  return (
    // TODO: Break `paddingRight: 2, marginRight: -2` out to an independent component if it becomes
    // a consistent pattern. We are adding this style to push the scrollbar to the edge of the page,
    // so that it will look good on Operating Systems like Windows where scrollbars are always visible.
    <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', paddingRight: 2, marginRight: -2 }}>
      {getCompanyUsersQuery.data?.map((user) => (
        <TeamMemberRow key={user._id}>
          <UserAvatar user={user} />
          <Typography variant="body1" sx={{ flex: 1 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <UserRoleSelect
            disabled={isSignedInUserAdmin && user._id === signedInUser._id}
            value={getUserRole(user)}
            onChange={(e) => handleRoleChange(e, user)}
            variant="filled"
            disableUnderline
            size="small"
            sx={{ width: '113px', height: '30px' }}
          />
        </TeamMemberRow>
      ))}

      {getPendingCompanyInvitesQuery.data?.map((invite) => (
        <TeamMemberRow key={invite._id}>
          <UserAvatar email={invite.email} />
          <Stack spacing={0.25} sx={{ flex: 1 }}>
            <Typography variant="body1">{invite.email}</Typography>
            <Typography variant="body2" color="error">
              Pending invite
            </Typography>
          </Stack>
        </TeamMemberRow>
      ))}
    </Stack>
  );
};
