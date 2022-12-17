import Head from 'next/head';
import { Box } from '@mui/material';

const Resources = () => {
  return (
    <>
      <Head>
        <title>Tool Viewer</title>
      </Head>
      <main>
        <Box data-testid="resources">Resources</Box>
      </main>
    </>
  );
};

export default Resources;
