import React from 'react';
import { SettingsPageLayout } from '@app/components/settings/SettingsPageLayout';
import { Typography } from '@mui/material';

const Team = () => {
  return (
    <SettingsPageLayout title="Team & Permissions">
      <Typography variant="h2" component="div" sx={{ marginTop: '100px', textAlign: 'center' }}>
        Work in Progress
      </Typography>
    </SettingsPageLayout>
  );
};

export default Team;
