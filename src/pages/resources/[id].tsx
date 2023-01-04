import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';

const ResourceSettings = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Resource Settings')}</title>
      </Head>
      <main>
        <Box>Resource Settings</Box>
      </main>
    </>
  );
};

export default ResourceSettings;
