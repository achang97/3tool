import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';

const Settings = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Settings')}</title>
      </Head>
      <main>
        <Box>Settings</Box>
      </main>
    </>
  );
};

export default Settings;
