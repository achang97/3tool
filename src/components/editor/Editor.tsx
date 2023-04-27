import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from 'react-resizable-panels';
import { setActionViewHeight } from '@app/redux/features/editorSlice';
import { ACTION_VIEW_MAX_HEIGHT, ACTION_VIEW_MIN_HEIGHT } from '@app/constants';
import { EditorActions } from './EditorActions';
import { EditorCanvas } from './EditorCanvas';
import { EditorSidebar } from './EditorSidebar';
import { useToolElementNames } from './hooks/useToolElementNames';
import { ResourceDialogs } from '../resources/ResourceDialogs';

export const Editor = () => {
  const { elementNames } = useToolElementNames();
  const { isPreview, actionViewHeight } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const rerenderKey = useMemo(() => {
    return elementNames.join('|');
  }, [elementNames]);

  const actionPanelRef = useRef<ImperativePanelGroupHandle>(null);

  useEffect(() => {
    if (actionViewHeight) {
      actionPanelRef.current?.setLayout([100 - actionViewHeight, actionViewHeight]);
    }
  }, [actionViewHeight]);

  const handleLayoutChange = useCallback(
    (sizes: number[]) => {
      dispatch(setActionViewHeight(sizes[1]));
    },
    [dispatch]
  );

  return (
    <>
      <Stack direction="row" sx={{ flex: 1, minHeight: 0 }} data-testid="editor">
        <PanelGroup direction="vertical" onLayout={handleLayoutChange} ref={actionPanelRef}>
          <Panel>
            <EditorCanvas isEditable={!isPreview} />
          </Panel>
          {!isPreview && (
            <>
              <Box sx={{ borderTop: 0.5, borderColor: 'divider' }}>
                <PanelResizeHandle style={{ height: 5 }} />
              </Box>
              <Panel
                defaultSize={ACTION_VIEW_MIN_HEIGHT}
                minSize={ACTION_VIEW_MIN_HEIGHT}
                maxSize={ACTION_VIEW_MAX_HEIGHT}
              >
                <EditorActions />
              </Panel>
            </>
          )}
        </PanelGroup>
        {!isPreview && <EditorSidebar key={rerenderKey} />}
      </Stack>
      {!isPreview && <ResourceDialogs />}
    </>
  );
};
