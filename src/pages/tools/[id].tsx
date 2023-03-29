import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { ToolSnackbarProvider } from '@app/components/editor/contexts/ToolSnackbarProvider';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { Tool } from '@app/types';
import { getServerSideProps } from '@app/pageGetters/tools';
import { ToolViewerToolbar } from '@app/components/toolbar/viewer/ToolViewerToolbar';
import { EditorApp } from '@app/components/editor/EditorApp';

type ToolPageProps = {
  tool: Tool;
};

const ToolViewer = ({ tool }: ToolPageProps) => {
  return (
    <>
      <Head>
        <title>{createTitle(tool.name)}</title>
      </Head>
      <main>
        <ToolSnackbarProvider>
          <ActiveToolProvider tool={tool}>
            <ActionQueueProvider>
              <PageContainer sx={{ padding: 0 }}>
                <ToolViewerToolbar />
                <EditorApp isEditable={false} />
              </PageContainer>
            </ActionQueueProvider>
          </ActiveToolProvider>
        </ToolSnackbarProvider>
      </main>
    </>
  );
};

export { getServerSideProps };

export default ToolViewer;
