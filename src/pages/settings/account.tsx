import React from 'react';
import { SettingsPageLayout } from '@app/components/settings/SettingsPageLayout';
import { Typography } from '@mui/material';

const Account = () => {
  return (
    <SettingsPageLayout title="Account information">
      <Typography variant="h2" component="div" sx={{ marginTop: '100px', textAlign: 'center' }}>
        Work in Progress
      </Typography>
    </SettingsPageLayout>
  );
};

export default Account;
