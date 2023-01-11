import { Box } from '@mui/material';
import Head from 'next/head';
import { EditorCanvas } from '@app/components/editor/EditorCanvas';
import { EditorSidebar } from '@app/components/editor/EditorSidebar';
import { EditorQueryBuilder } from '@app/components/editor/EditorQueryBuilder';
import { getTitle } from '@app/utils/window';

const Editor = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Tool Editor')}</title>
      </Head>
      <main>
        <Box sx={{ height: '100%', display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <EditorCanvas />
            <EditorQueryBuilder />
          </Box>
          <EditorSidebar />
        </Box>
      </main>
    </>
  );
};

export default Editor;
