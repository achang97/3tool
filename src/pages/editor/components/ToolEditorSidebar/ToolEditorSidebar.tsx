import { useCallback, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { SidebarViewType } from '@app/types';
import { updateSidebarView } from '@app/redux/features/editorSlice';
import { ToolEditorPicker } from './ToolEditorPicker';
import { ToolEditorInspector } from './ToolEditorInspector';

export const ToolEditorSidebar = () => {
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
          <ToolEditorInspector />
        </TabPanel>
        <TabPanel value={SidebarViewType.Create}>
          <ToolEditorPicker />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
