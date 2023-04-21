import React from 'react';
import { SettingsPageLayout } from '@app/components/settings/SettingsPageLayout';
import { Typography } from '@mui/material';
import { PageTitle } from '@app/components/common/PageTitle';

const Account = () => {
  return (
    <SettingsPageLayout title="Account information">
      <PageTitle>Account information</PageTitle>
      <Typography variant="h2" component="div" sx={{ marginTop: '100px', textAlign: 'center' }}>
        Work in Progress
      </Typography>
    </SettingsPageLayout>
  );
};

export default Account;
