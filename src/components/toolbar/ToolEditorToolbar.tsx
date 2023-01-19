import { useCallback, useMemo } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { useAppDispatch } from '@app/redux/hooks';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import { ToolbarTemplate } from './ToolbarTemplate';
import { EditableTextField } from '../common/EditableTextField';
import { useGetActiveTool } from '../editor/hooks/useGetActiveTool';
import { useUpdateActiveTool } from '../editor/hooks/useUpdateActiveTool';

export const ToolEditorToolbar = () => {
  const dispatch = useAppDispatch();
  const tool = useGetActiveTool();
  const updateTool = useUpdateActiveTool();

  const handleUpdateToolName = useCallback(
    (name: string) => {
      if (tool && name) {
        updateTool({ id: tool.id, name });
      }
    },
    [tool, updateTool]
  );

  const handleSettingsClick = useCallback(() => {
    dispatch(focusToolSettings());
  }, [dispatch]);

  const middle = useMemo(() => {
    if (!tool) {
      return undefined;
    }

    return (
      <EditableTextField
        value={tool.name}
        onSubmit={handleUpdateToolName}
        TypographyProps={{ sx: { whiteSpace: 'nowrap' } }}
        TextFieldProps={{ fullWidth: true }}
      />
    );
  }, [tool, handleUpdateToolName]);

  const right = useMemo(() => {
    if (!tool) {
      return undefined;
    }

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={handleSettingsClick}
          data-testid="tool-editor-toolbar-settings-button"
        >
          <Tune />
        </IconButton>
        <Button color="secondary" size="small">
          Preview
        </Button>
        <Button size="small">Publish</Button>
      </Box>
    );
  }, [tool, handleSettingsClick]);

  return (
    <ToolbarTemplate
      middle={middle}
      right={right}
      testId="tool-editor-toolbar"
    />
  );
};
