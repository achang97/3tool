import Head from 'next/head';
import { Box, Typography } from '@mui/material';

const Error404 = () => {
  return (
    <>
      <Head>
        <title>404 Error</title>
      </Head>
      <main>
        <Box data-testid="error-404">
          <Typography>This page does not exist.</Typography>
        </Box>
      </main>
    </>
  );
};

export default Error404;
