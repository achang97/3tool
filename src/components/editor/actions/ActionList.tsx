import { Box, Divider, Typography } from '@mui/material';
import { useActiveTool } from '../hooks/useActiveTool';
import { EmptyPlaceholder } from './common/EmptyPlaceholder';
import { ActionListItem } from './list/ActionListItem';
import { CreateActionButton } from './list/CreateActionButton';

export const ActionList = () => {
  const { tool } = useActiveTool();

  return (
    <Box
      sx={{
        paddingY: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      data-testid="action-list"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: 2,
        }}
      >
        <Typography variant="subtitle2">Action list</Typography>
        <CreateActionButton />
      </Box>
      <Divider sx={{ margin: 1, marginX: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
          overflow: 'auto',
          paddingX: 2,
        }}
      >
        {tool.actions.length === 0 && (
          <EmptyPlaceholder> No created actions </EmptyPlaceholder>
        )}
        {tool.actions.map((action) => (
          <ActionListItem key={action.name} action={action} />
        ))}
      </Box>
    </Box>
  );
};
