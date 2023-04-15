import { GLOBAL_LIBRARIES } from '@app/constants';
import { Web } from '@mui/icons-material';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { InspectorHeader } from './InspectorHeader';
import { InspectorSection } from './InspectorSection';

export const ToolInspector = () => {
  return (
    <Stack data-testid="tool-inspector" sx={{ height: '100%' }}>
      <InspectorHeader title="tool" icon={<Web />} isEditable={false} />
      <Box sx={{ overflow: 'auto', minHeight: 0 }}>
        <InspectorSection title="Libraries">
          <Box>
            {GLOBAL_LIBRARIES.map(({ label }) => (
              <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                key={label}
              >
                <Typography variant="body2">{label}</Typography>
                <Checkbox checked size="small" />
              </Stack>
            ))}
          </Box>
        </InspectorSection>
      </Box>
    </Stack>
  );
};
