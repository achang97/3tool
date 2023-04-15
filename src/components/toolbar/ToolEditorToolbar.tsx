import { useCallback, useMemo } from 'react';
import { Button, IconButton, Stack } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { focusToolSettings, setIsPreview } from '@app/redux/features/editorSlice';
import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { EditableTextField } from '@app/components/common/EditableTextField';
import { ToolbarTemplate } from './common/ToolbarTemplate';

export const ToolEditorToolbar = () => {
  const dispatch = useAppDispatch();
  const { isPreview } = useAppSelector((state) => state.editor);

  const { tool, updateTool } = useActiveTool();

  const handleUpdateToolName = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }
      updateTool({ name });
    },
    [updateTool]
  );

  const handleSettingsClick = useCallback(() => {
    dispatch(focusToolSettings());
  }, [dispatch]);

  const handlePreviewClick = useCallback(() => {
    dispatch(setIsPreview(!isPreview));
  }, [dispatch, isPreview]);

  const middle = useMemo(() => {
    return (
      <EditableTextField
        value={tool.name}
        onSubmit={handleUpdateToolName}
        showIcon
        TypographyProps={{
          sx: {
            whiteSpace: 'nowrap',
            width: 'fit-content',
            margin: 'auto',
            paddingRight: 2.5,
          },
        }}
      />
    );
  }, [handleUpdateToolName, tool.name]);

  const right = useMemo(() => {
    return (
      <Stack direction="row" spacing={1}>
        <IconButton onClick={handleSettingsClick} data-testid="tool-editor-toolbar-settings-button">
          <Tune />
        </IconButton>
        <Button color="secondary" size="small" onClick={handlePreviewClick}>
          {isPreview ? 'Editor' : 'Preview'}
        </Button>
      </Stack>
    );
  }, [handlePreviewClick, handleSettingsClick, isPreview]);

  return <ToolbarTemplate middle={middle} right={right} testId="tool-editor-toolbar" />;
};
