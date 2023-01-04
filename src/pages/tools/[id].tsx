import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';

const ToolViewer = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Tool Viewer')}</title>
      </Head>
      <main>
        <Box>Tool Viewer</Box>
      </main>
    </>
  );
};

export default ToolViewer;
