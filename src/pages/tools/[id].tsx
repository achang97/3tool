import Head from 'next/head';
import { useEffect } from 'react';
import { createTitle } from '@app/utils/window';
import { ToolSnackbarProvider } from '@app/components/editor/contexts/ToolSnackbarProvider';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolViewerToolbar } from '@app/components/toolbar/ToolViewerToolbar';
import { EditorApp } from '@app/components/editor/EditorApp';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
import { useAppDispatch } from '@app/redux/hooks';
import { resetActiveTool } from '@app/redux/features/activeToolSlice';

const ToolViewer = () => {
  const tool = useQueryTool();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetActiveTool());
    };
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>{createTitle(tool?.name ?? 'Tool Viewer')}</title>
      </Head>
      <main>
        {tool ? (
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
        ) : (
          <FullscreenLoader />
        )}
      </main>
    </>
  );
};

export default ToolViewer;
