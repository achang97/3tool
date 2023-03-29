import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { Tool } from '@app/types';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolEditorToolbar } from '@app/components/toolbar/editor/ToolEditorToolbar';
import { ToolSnackbarProvider } from '@app/components/editor/contexts/ToolSnackbarProvider';
import { Editor } from '@app/components/editor/Editor';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { getServerSideProps } from '@app/pageGetters/tools';

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
            <ActionQueueProvider>
              <PageContainer sx={{ padding: 0 }}>
                <ToolEditorToolbar />
                <Editor />
              </PageContainer>
            </ActionQueueProvider>
          </ActiveToolProvider>
        </ToolSnackbarProvider>
      </main>
    </>
  );
};

export { getServerSideProps };

export default EditorPage;
