import { SyntheticEvent, useCallback } from 'react';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { SidebarViewType } from '@app/types';
import { setSidebarView } from '@app/redux/features/editorSlice';
import { ComponentPicker } from './sidebar/ComponentPicker';
import { Inspector } from './sidebar/Inspector';

const WIDTH = '300px';

const TABS = [
  {
    label: 'Components',
    panel: <ComponentPicker />,
    value: SidebarViewType.Components,
  },
  {
    label: 'Inspector',
    panel: <Inspector />,
    value: SidebarViewType.Inspector,
  },
];

export const EditorSidebar = () => {
  const { sidebarView } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleTabChange = useCallback(
    (e: SyntheticEvent, newSidebarView: SidebarViewType) => {
      dispatch(setSidebarView(newSidebarView));
    },
    [dispatch]
  );

  return (
    <Stack sx={{ width: WIDTH, flexShrink: 0, minHeight: 0 }} data-testid="editor-sidebar">
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'greyscale.offwhite.main',
        }}
      >
        <Tabs value={sidebarView} onChange={handleTabChange} sx={{ minHeight: 0 }}>
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
      <Box sx={{ boxShadow: 3, flex: 1, minHeight: 0 }}>
        <TabContext value={sidebarView}>
          {TABS.map((tab) => (
            <TabPanel key={tab.label} value={tab.value} sx={{ padding: 0, height: '100%' }}>
              {tab.panel}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Stack>
  );
};
