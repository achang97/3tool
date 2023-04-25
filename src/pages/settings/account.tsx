import React from 'react';
import { SettingsPageLayout } from '@app/components/settings/SettingsPageLayout';
import { PageTitle } from '@app/components/common/PageTitle';
import { UpdateUserName } from '@app/components/settings/UpdateUserName';
import { Divider, Stack } from '@mui/material';

const Account = () => {
  return (
    <SettingsPageLayout title="Account information">
      <PageTitle>Account information</PageTitle>
      <Stack spacing={2} divider={<Divider />}>
        <UpdateUserName />
      </Stack>
    </SettingsPageLayout>
  );
};

export default Account;
