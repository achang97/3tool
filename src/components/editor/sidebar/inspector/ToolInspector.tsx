import { GLOBAL_LIBRARIES } from '@app/utils/global';
import { Web } from '@mui/icons-material';
import { Box, Checkbox, Typography } from '@mui/material';
import { InspectorEditableName } from './InspectorEditableName';
import { InspectorSection } from './InspectorSection';

export const ToolInspector = () => {
  return (
    <Box data-testid="tool-inspector">
      <InspectorEditableName value="tool" icon={<Web />} editable={false} />
      <InspectorSection title="Libraries">
        <Box>
          {GLOBAL_LIBRARIES.map(({ label }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              key={label}
            >
              <Typography variant="body2">{label}</Typography>
              <Checkbox checked size="small" />
            </Box>
          ))}
        </Box>
      </InspectorSection>
    </Box>
  );
};
