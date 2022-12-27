import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';

const Resources = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Resources')}</title>
      </Head>
      <main>
        <Box data-testid="resources">Resources</Box>
      </main>
    </>
  );
};

export default Resources;
