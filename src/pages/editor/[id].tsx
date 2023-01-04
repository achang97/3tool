import { Box } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import Head from 'next/head';
import { ToolEditorCanvas } from '@app/components/editor/ToolEditorCanvas/ToolEditorCanvas';
import { ToolEditorSidebar } from '@app/components/editor/ToolEditorSidebar/ToolEditorSidebar';
import { ToolEditorQueryBuilder } from '@app/components/editor/ToolEditorQueryBuilder/ToolEditorQueryBuilder';
import { getTitle } from '@app/utils/window';

const ToolEditor = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Tool Editor')}</title>
      </Head>
      <main>
        <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
            <Box sx={{ flex: 3 }}>
              <Web3Button />
              <ToolEditorCanvas />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ToolEditorQueryBuilder />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <ToolEditorSidebar />
          </Box>
        </Box>
      </main>
    </>
  );
};

export default ToolEditor;
