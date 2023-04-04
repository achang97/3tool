import { useCallback, useMemo } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import {
  focusToolSettings,
  setIsPreview,
} from '@app/redux/features/editorSlice';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useRouter } from 'next/router';
import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { EditableTextField } from '@app/components/common/EditableTextField';
import { ToolbarTemplate } from './common/ToolbarTemplate';

export const ToolEditorToolbar = () => {
  const dispatch = useAppDispatch();
  const { isPreview } = useAppSelector((state) => state.editor);

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
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={handleSettingsClick}
          data-testid="tool-editor-toolbar-settings-button"
        >
          <Tune />
        </IconButton>
        <Button color="secondary" size="small" onClick={handlePreviewClick}>
          {isPreview ? 'Editor' : 'Preview'}
        </Button>
      </Box>
    );
  }, [handlePreviewClick, handleSettingsClick, isPreview]);

  return (
    <ToolbarTemplate
      middle={middle}
      right={right}
      testId="tool-editor-toolbar"
    />
  );
};
