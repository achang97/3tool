import { useCallback, useMemo } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useGetToolByIdQuery } from '@app/redux/services/tools';
import { useRouter } from 'next/router';
import { Tune } from '@mui/icons-material';
import { useAppDispatch } from '@app/redux/hooks';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import { ToolbarTemplate } from './ToolbarTemplate';

export const ToolEditorToolbar = () => {
  const {
    query: { id },
  } = useRouter();
  const dispatch = useAppDispatch();
  const { data: tool } = useGetToolByIdQuery(id as string);

  const middle = useMemo(() => {
    return <Typography>{tool ? tool.name : 'Untitled'}</Typography>;
  }, [tool]);

  const handleSettingsClick = useCallback(() => {
    dispatch(focusToolSettings());
  }, [dispatch]);

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
