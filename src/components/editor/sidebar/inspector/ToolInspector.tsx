import { GLOBAL_LIBRARIES } from '@app/constants';
import { Web } from '@mui/icons-material';
import { Box, Checkbox, Typography } from '@mui/material';
import { InspectorEditableName } from './InspectorEditableName';
import { InspectorSection } from './InspectorSection';

export const ToolInspector = () => {
  return (
    <Box
      data-testid="tool-inspector"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <InspectorEditableName value="tool" icon={<Web />} editable={false} />
      <Box sx={{ overflow: 'auto', minHeight: 0 }}>
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
    </Box>
  );
};
