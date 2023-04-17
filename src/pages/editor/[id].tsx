import Head from 'next/head';
import { createTitle } from '@app/utils/window';
import { ActiveToolProvider } from '@app/components/editor/contexts/ActiveToolContext';
import { PageContainer } from '@app/components/common/PageContainer';
import { ToolEditorToolbar } from '@app/components/toolbar/ToolEditorToolbar';
import { Editor } from '@app/components/editor/Editor';
import { ActionQueueProvider } from '@app/components/editor/contexts/ActionQueueContext';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
import { useEffect } from 'react';
import { useAppDispatch } from '@app/redux/hooks';
import { resetEditor } from '@app/redux/features/editorSlice';
import { resetActiveTool } from '@app/redux/features/activeToolSlice';

const EditorPage = () => {
  const tool = useQueryTool();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetEditor());
      dispatch(resetActiveTool());
    };
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>{createTitle(`${tool?.name ?? ''} | Editor `)}</title>
      </Head>
      <main>
        {tool ? (
          <ActiveToolProvider tool={tool}>
            <ActionQueueProvider>
              <PageContainer sx={{ padding: 0 }}>
                <ToolEditorToolbar />
                <Editor />
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

export default EditorPage;
