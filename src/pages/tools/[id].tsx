import Head from 'next/head';
import { Box } from '@mui/material';

const ToolViewer = () => {
  return (
    <>
      <Head>
        <title>Tool Viewer</title>
      </Head>
      <main>
        <Box data-testid="tool-viewer">Tool Viewer</Box>
      </main>
    </>
  );
};

export default ToolViewer;
