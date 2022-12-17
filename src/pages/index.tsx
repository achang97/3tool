import Head from 'next/head';
import { Box } from '@mui/material';

const Tools = () => {
  return (
    <>
      <Head>
        <title>Tools</title>
      </Head>
      <main>
        <Box data-testid="tools">Tools</Box>
      </main>
    </>
  );
};

export default Tools;
