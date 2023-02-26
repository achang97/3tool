import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { GetServerSideProps } from 'next';
import { wrapper } from '@app/redux/store';
import { getRunningQueriesThunk, getToolById } from '@app/redux/services/tools';
import { Tool } from '@app/types';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolEditorToolbar } from '@app/components/toolbar/editor/ToolEditorToolbar';
import { ToolSnackbarProvider } from '@app/components/editor/contexts/ToolSnackbarProvider';
import { Editor } from '@app/components/editor/Editor';

type EditorPageProps = {
  tool: Tool;
};

const EditorPage = ({ tool }: EditorPageProps) => {
  return (
    <>
      <Head>
        <title>{createTitle(`${tool.name} | Editor `)}</title>
      </Head>
      <main>
        <ToolSnackbarProvider>
          <ActiveToolProvider tool={tool}>
            <PageContainer sx={{ padding: 0 }}>
              <ToolEditorToolbar />
              <Editor />
            </PageContainer>
          </ActiveToolProvider>
        </ToolSnackbarProvider>
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

export default EditorPage;
