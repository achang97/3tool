import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action, ActionType, BaseActionEditorProps } from '@app/types';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, FC, useCallback, useState } from 'react';
import { SaveRunButton } from './editor/common/SaveRunButton';
import { JavascriptEditor } from './editor/general/JavascriptEditor';
import { SmartContractEditor } from './editor/general/SmartContractEditor';
import { ResponseHandlerEditor } from './editor/responseHandler/ResponseHandlerEditor';

type ActionEditorProps = {
  action: Action;
};

enum ActionTabType {
  General = 'general',
  ResponseHandler = 'responseHandler',
}

const ACTION_EDITOR_MAP: Record<ActionType, FC<BaseActionEditorProps>> = {
  [ActionType.Javascript]: JavascriptEditor,
  [ActionType.SmartContractRead]: SmartContractEditor,
  [ActionType.SmartContractWrite]: SmartContractEditor,
};

export const ActionEditor = ({ action }: ActionEditorProps) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ActionTabType>(
    ActionTabType.General
  );

  const handleTabChange = useCallback(
    (e: React.SyntheticEvent, newTab: ActionTabType) => {
      setActiveTab(newTab);
    },
    []
  );

  const handleUpdateData = useCallback(
    (update: RecursivePartial<ValueOf<Action['data']>>) => {
      dispatch(updateFocusedAction({ data: { [action.type]: update } }));
    },
    [action.type, dispatch]
  );

  const typedEditor = useMemo(() => {
    const TypedEditor = ACTION_EDITOR_MAP[action.type];

    return (
      <TypedEditor
        key={action.name}
        type={action.type}
        data={action.data}
        onUpdateData={handleUpdateData}
      />
    );
  }, [action.data, action.name, action.type, handleUpdateData]);

  const tabs = useMemo(
    () => [
      {
        label: 'General',
        panel: typedEditor,
        value: ActionTabType.General,
      },
      {
        label: 'Response Handler',
        panel: <ResponseHandlerEditor />,
        value: ActionTabType.ResponseHandler,
      },
    ],
    [typedEditor]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
      }}
      data-testid="action-editor"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          paddingX: 1,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ minHeight: 0 }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              value={tab.value}
              sx={{ minHeight: 0, fontSize: '0.8rem' }}
            />
          ))}
        </Tabs>
        <SaveRunButton type={action.type} />
      </Box>
      <TabContext value={activeTab}>
        {tabs.map((tab) => (
          <TabPanel
            key={tab.label}
            value={tab.value}
            sx={{
              flex: 1,
              minHeight: 0,
              paddingY: 1,
              paddingX: 2,
              overflow: 'auto',
            }}
          >
            {tab.panel}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};
