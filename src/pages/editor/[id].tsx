import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolEditorToolbar } from '@app/components/toolbar/ToolEditorToolbar';
import { ToolSnackbarProvider } from '@app/components/editor/contexts/ToolSnackbarProvider';
import { Editor } from '@app/components/editor/Editor';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';

const EditorPage = () => {
  const tool = useQueryTool();

  return (
    <>
      <Head>
        <title>{createTitle(`${tool?.name ?? ''} | Editor `)}</title>
      </Head>
      <main>
        {tool ? (
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
        ) : (
          <FullscreenLoader />
        )}
      </main>
    </>
  );
};

export default EditorPage;
