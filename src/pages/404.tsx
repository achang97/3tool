import Head from 'next/head';
import { Box, Button, Typography } from '@mui/material';
import { WebAssetOff } from '@mui/icons-material';
import { getTitle } from '@app/utils/window';
import Link from 'next/link';

const Error404 = () => {
  return (
    <>
      <Head>
        <title>{getTitle('404 Error')}</title>
      </Head>
      <main>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <WebAssetOff sx={{ fontSize: '100px', color: 'text.primary' }} />
          <Typography variant="h2">Whoops!</Typography>
          <Typography variant="h6" sx={{ marginTop: 1 }}>
            It seems like the page you’re looking for is missing.
          </Typography>
          <Button variant="contained" sx={{ marginTop: 5 }}>
            <Link href="/">Go back home</Link>
          </Button>
          <Typography
            color="greyscale.offwhite.main"
            sx={{
              position: 'absolute',
              fontSize: '450px',
              fontWeight: 800,
              zIndex: -1,
            }}
          >
            404
          </Typography>
        </Box>
      </main>
    </>
  );
};

export default Error404;
