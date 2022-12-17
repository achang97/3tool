import { Box } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import Head from 'next/head';
import { ToolEditorCanvas } from './components/ToolEditorCanvas/ToolEditorCanvas';
import { ToolEditorSidebar } from './components/ToolEditorSidebar/ToolEditorSidebar';
import { ToolEditorQueryBuilder } from './components/ToolEditorQueryBuilder/ToolEditorQueryBuilder';

const ToolEditor = () => {
  return (
    <>
      <Head>
        <title>Tool Editor</title>
      </Head>
      <Box
        data-testid="tool-editor"
        sx={{ width: '100%', height: '100%', display: 'flex' }}
      >
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
    </>
  );
};

export default ToolEditor;
