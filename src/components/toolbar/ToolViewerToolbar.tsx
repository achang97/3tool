import { useMemo } from 'react';
import { Button, Typography } from '@mui/material';
import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import Link from 'next/link';
import { ToolbarTemplate } from './common/ToolbarTemplate';

export const ToolViewerToolbar = () => {
  const { tool } = useActiveTool();

  const middle = useMemo(() => {
    return <Typography>{tool.name}</Typography>;
  }, [tool.name]);

  const right = useMemo(() => {
    return (
      <Button
        size="small"
        LinkComponent={Link}
        href={`/editor/${tool._id}/${encodeURIComponent(tool.name)}`}
      >
        Edit app
      </Button>
    );
  }, [tool._id, tool.name]);

  return <ToolbarTemplate middle={middle} right={right} testId="tool-viewer-toolbar" />;
};
