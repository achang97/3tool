import { Box } from '@mui/material';
import Head from 'next/head';
import { EditorCanvas } from '@app/components/editor/EditorCanvas';
import { EditorSidebar } from '@app/components/editor/EditorSidebar';
import { EditorActions } from '@app/components/editor/EditorActions';
import { getTitle } from '@app/utils/window';
import { EditorSnackbar } from '@app/components/editor/EditorSnackbar';
import { GetServerSideProps } from 'next';
import { wrapper } from '@app/redux/store';
import { getRunningQueriesThunk, getToolById } from '@app/redux/services/tools';
import { Tool } from '@app/types';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolEditorToolbar } from '@app/components/toolbar/editor/ToolEditorToolbar';

type EditorProps = {
  tool: Tool;
};

const Editor = ({ tool }: EditorProps) => {
  return (
    <>
      <Head>
        <title>{getTitle(`${tool.name} | Editor `)}</title>
      </Head>
      <main>
        <ActiveToolProvider tool={tool}>
          <PageContainer sx={{ padding: 0 }}>
            <ToolEditorToolbar />
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  position: 'relative',
                }}
              >
                <EditorCanvas />
                <EditorActions />
              </Box>
              <EditorSidebar />
              <EditorSnackbar />
            </Box>
          </PageContainer>
        </ActiveToolProvider>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const id = context.params?.id;
    if (typeof id === 'string') {
      store.dispatch(getToolById.initiate(id));
    }

    const [result] = await Promise.all(
      store.dispatch(getRunningQueriesThunk())
    );

    if (!result || result.isError) {
      return { notFound: true };
    }

    return {
      props: { tool: result.data },
    };
  });

export default Editor;
