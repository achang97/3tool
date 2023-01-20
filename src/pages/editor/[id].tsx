import { Box } from '@mui/material';
import Head from 'next/head';
import { EditorCanvas } from '@app/components/editor/EditorCanvas';
import { EditorSidebar } from '@app/components/editor/EditorSidebar';
import { EditorQueryBuilder } from '@app/components/editor/EditorQueryBuilder';
import { getTitle } from '@app/utils/window';
import { EditorSnackbar } from '@app/components/editor/EditorSnackbar';
import { GetServerSideProps } from 'next';
import { wrapper } from '@app/redux/store';
import { getRunningQueriesThunk, getToolById } from '@app/redux/services/tools';

const Editor = () => {
  return (
    <>
      <Head>
        <title>{getTitle('Tool Editor')}</title>
      </Head>
      <main>
        <Box sx={{ height: '100%', display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              position: 'relative',
            }}
          >
            <EditorCanvas />
            <EditorQueryBuilder />
          </Box>
          <EditorSidebar />
          <EditorSnackbar />
        </Box>
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
      props: {},
    };
  });

export default Editor;
