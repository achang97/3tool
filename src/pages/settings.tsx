import Head from 'next/head';
import { Box } from '@mui/material';
import { createTitle } from '@app/utils/window';

const Settings = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Settings')}</title>
      </Head>
      <main>
        <Box>Settings</Box>
      </main>
    </>
  );
};

export default Settings;
