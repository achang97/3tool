import Head from 'next/head';
import { useEffect } from 'react';
import { createTitle } from '@app/utils/window';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolViewerToolbar } from '@app/components/toolbar/ToolViewerToolbar';
import { EditorApp } from '@app/components/editor/EditorApp';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
import { useAppDispatch } from '@app/redux/hooks';
import { resetActiveTool } from '@app/redux/features/activeToolSlice';
import { useRouter } from 'next/router';

const ToolViewer = () => {
  const { query } = useRouter();
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
        <title>{createTitle(query.name?.toString() ?? 'Tool Viewer')}</title>
      </Head>
      <main>
        {tool ? (
          <ActiveToolProvider tool={tool}>
            <ActionQueueProvider>
              <PageContainer sx={{ padding: 0 }}>
                <ToolViewerToolbar />
                <EditorApp isEditable={false} />
              </PageContainer>
            </ActionQueueProvider>
          </ActiveToolProvider>
        ) : (
          <FullscreenLoader />
        )}
      </main>
    </>
  );
};

export default ToolViewer;
