import { useCallback, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { SidebarViewType } from '@app/types';
import { updateSidebarView } from '@app/redux/features/editorSlice';
import { EditorComponentPicker } from './EditorComponentPicker';
import { EditorComponentInspector } from './EditorComponentInspector';

const WIDTH = '300px';

const TABS = [
  {
    label: 'Components',
    panel: <EditorComponentPicker />,
    value: SidebarViewType.Components,
  },
  {
    label: 'Inspector',
    panel: <EditorComponentInspector />,
    value: SidebarViewType.Inspector,
  },
];

export const EditorSidebar = () => {
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
        focusedComponentId
          ? SidebarViewType.Inspector
          : SidebarViewType.Components
      )
    );
  }, [focusedComponentId, dispatch]);

  return (
    <Box sx={{ width: WIDTH, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'greyscale.offwhite.main',
        }}
      >
        <Tabs
          value={sidebarView}
          onChange={handleTabChange}
          sx={{ minHeight: 0 }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              value={tab.value}
              sx={{ minHeight: 0, padding: 1.5 }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ boxShadow: 3, flex: 1 }}>
        <TabContext value={sidebarView}>
          {TABS.map((tab) => (
            <TabPanel key={tab.label} value={tab.value} sx={{ padding: 0 }}>
              {tab.panel}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Box>
  );
};
