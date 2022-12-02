import React, { memo, useCallback, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SidebarViewType } from 'types';
import { updateSidebarView } from 'redux/features/editorSlice';
import { EditorPicker } from './EditorPicker';
import { EditorInspector } from './EditorInspector';

export const EditorSidebar = memo(() => {
  const { sidebarView, focusedComponentId } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();

  const handleTabChange = useCallback(
    (e: React.SyntheticEvent, newSidebarView: SidebarViewType) => {
      dispatch(updateSidebarView(newSidebarView));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(
      updateSidebarView(
        focusedComponentId ? SidebarViewType.Inspect : SidebarViewType.Create
      )
    );
  }, [focusedComponentId, dispatch]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={sidebarView} onChange={handleTabChange}>
          <Tab label="Inspect" value={SidebarViewType.Inspect} />
          <Tab label="Create" value={SidebarViewType.Create} />
        </Tabs>
      </Box>
      <TabContext value={sidebarView}>
        <TabPanel value={SidebarViewType.Inspect}>
          <EditorInspector />
        </TabPanel>
        <TabPanel value={SidebarViewType.Create}>
          <EditorPicker />
        </TabPanel>
      </TabContext>
    </Box>
  );
});
