import Head from 'next/head';
import { Box } from '@mui/material';

const Settings = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <main>
        <Box data-testid="settings">Settings</Box>
      </main>
    </>
  );
};

export default Settings;
