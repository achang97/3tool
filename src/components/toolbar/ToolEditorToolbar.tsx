import { useCallback, useMemo } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { useAppDispatch } from '@app/redux/hooks';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ToolbarTemplate } from './ToolbarTemplate';
import { EditableTextField } from '../common/EditableTextField';
import { useActiveTool } from '../editor/hooks/useActiveTool';

export const ToolEditorToolbar = () => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();
  const { reload } = useRouter();

  const handleUpdateToolName = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }

      const response = await updateTool({ name });
      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      reload();
    },
    [reload, updateTool]
  );

  const handleSettingsClick = useCallback(() => {
    dispatch(focusToolSettings());
  }, [dispatch]);

  const middle = useMemo(() => {
    return (
      <EditableTextField
        value={tool.name}
        onSubmit={handleUpdateToolName}
        TypographyProps={{ sx: { whiteSpace: 'nowrap' } }}
        TextFieldProps={{ fullWidth: true }}
      />
    );
  }, [handleUpdateToolName, tool.name]);

  const right = useMemo(() => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={handleSettingsClick}
          data-testid="tool-editor-toolbar-settings-button"
        >
          <Tune />
        </IconButton>
        <Button
          color="secondary"
          size="small"
          LinkComponent={Link}
          href={`/tools/${tool.id}`}
        >
          Preview
        </Button>
      </Box>
    );
  }, [handleSettingsClick, tool.id]);

  return (
    <ToolbarTemplate
      middle={middle}
      right={right}
      testId="tool-editor-toolbar"
    />
  );
};
