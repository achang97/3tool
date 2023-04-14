import { setActionView, updateFocusedAction } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Action, ActionType, ActionViewType, BaseActionEditorProps } from '@app/types';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, useCallback, SyntheticEvent, FC } from 'react';
import { useActionCycleListener } from '../hooks/useActionCycleListener';
import { EditorToolbar } from './editor/common/EditorToolbar';
import { SaveRunButton } from './editor/common/SaveRunButton';
import { SizeControlButton } from './editor/common/SizeControlButton';
import { JavascriptEditor } from './editor/general/JavascriptEditor';
import { SmartContractEditor } from './editor/general/SmartContractEditor';
import { ResponseHandlerEditor } from './editor/responseHandler/ResponseHandlerEditor';

type ActionEditorProps = {
  action: Action;
};

const ACTION_EDITOR_MAP: {
  [KeyType in ActionType]: FC<BaseActionEditorProps<KeyType>>;
} = {
  [ActionType.Javascript]: JavascriptEditor,
  [ActionType.SmartContractRead]: SmartContractEditor,
  [ActionType.SmartContractWrite]: SmartContractEditor,
};

export const ActionEditor = ({ action }: ActionEditorProps) => {
  const dispatch = useAppDispatch();
  const { actionView } = useAppSelector((state) => state.editor);

  useActionCycleListener(action.name);

  const handleTabChange = useCallback(
    (e: SyntheticEvent, newTab: ActionViewType) => {
      dispatch(setActionView(newTab));
    },
    [dispatch]
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
        type={action.type}
        // @ts-ignore We know that this accesses the correct data key
        data={action.data[action.type]}
        onDataChange={handleUpdateData}
      />
    );
  }, [action.data, action.type, handleUpdateData]);

  const tabs = useMemo(
    () => [
      {
        label: 'General',
        panel: typedEditor,
        value: ActionViewType.General,
      },
      {
        label: 'Response Handler',
        panel: <ResponseHandlerEditor eventHandlers={action.eventHandlers} />,
        value: ActionViewType.ResponseHandler,
      },
    ],
    [action.eventHandlers, typedEditor]
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
      <EditorToolbar>
        <Tabs value={actionView} onChange={handleTabChange} sx={{ minHeight: 0 }}>
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              value={tab.value}
              sx={{ minHeight: 0, fontSize: '0.8rem' }}
            />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <SaveRunButton type={action.type} />
          <SizeControlButton />
        </Box>
      </EditorToolbar>
      <TabContext value={actionView}>
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
