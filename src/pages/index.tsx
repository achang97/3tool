import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';

const Tools = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Tools')}</title>
      </Head>
      <main>
        <Box data-testid="tools">Tools</Box>
      </main>
    </>
  );
};

export default Tools;
