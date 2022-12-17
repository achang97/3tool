import Head from 'next/head';
import { Box } from '@mui/material';

const ResourceSettings = () => {
  return (
    <>
      <Head>
        <title>Resource Settings</title>
      </Head>
      <main>
        <Box data-testid="resource-settings">Resource Settings</Box>
      </main>
    </>
  );
};

export default ResourceSettings;
