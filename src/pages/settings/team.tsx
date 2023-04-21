import React from 'react';
import { SettingsPageLayout } from '@app/components/settings/SettingsPageLayout';
import { TeamAndPermissions } from '@app/components/settings/TeamAndPermissions';
import { PageTitle } from '@app/components/common/PageTitle';
import { InviteCompanyUserButton } from '@app/components/settings/InviteCompanyUserButton';
import { Stack } from '@mui/material';
import { useUser } from '@app/hooks/useUser';

const Team = () => {
  const signedInUser = useUser();
  const isSignedInUserAdmin = signedInUser?.roles.isAdmin;

  return (
    <SettingsPageLayout title="Team & Permissions">
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageTitle>Team & Permissions</PageTitle>
        {isSignedInUserAdmin && <InviteCompanyUserButton />}
      </Stack>
      <TeamAndPermissions />
    </SettingsPageLayout>
  );
};

export default Team;
