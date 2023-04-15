import { Divider, Stack, Typography } from '@mui/material';
import { useActiveTool } from '../hooks/useActiveTool';
import { EmptyPlaceholder } from './common/EmptyPlaceholder';
import { ActionListItem } from './list/ActionListItem';
import { CreateActionButton } from './list/CreateActionButton';

export const ActionList = () => {
  const { tool } = useActiveTool();

  return (
    <Stack sx={{ paddingY: 1, height: '100%' }} data-testid="action-list">
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}
      >
        <Typography variant="subtitle2">Action list</Typography>
        <CreateActionButton />
      </Stack>
      <Divider sx={{ margin: 1, marginX: 2 }} />
      <Stack spacing={0.25} sx={{ overflow: 'auto', paddingX: 2 }}>
        {tool.actions.length === 0 && <EmptyPlaceholder> No created actions </EmptyPlaceholder>}
        {tool.actions.map((action) => (
          <ActionListItem key={action.name} action={action} />
        ))}
      </Stack>
    </Stack>
  );
};
