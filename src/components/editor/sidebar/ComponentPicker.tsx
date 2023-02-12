import { Box, Grid } from '@mui/material';
import { ComponentType } from '@app/types';
import Image from 'next/image';
import { useCallback } from 'react';
import { COMPONENT_CONFIGS } from '@app/constants';
import { DraggableComponent } from './components/DraggableComponent';

const COMPONENTS = [
  ComponentType.Button,
  ComponentType.TextInput,
  ComponentType.NumberInput,
  ComponentType.Text,
  ComponentType.Table,
];

export const ComponentPicker = () => {
  const renderComponent = useCallback((type: ComponentType) => {
    const { label, icon } = COMPONENT_CONFIGS[type];
    return (
      <DraggableComponent
        label={label}
        icon={<Image alt={label} src={icon} />}
        type={type}
      />
    );
  }, []);

  return (
    <Box
      sx={{ height: '100%', overflow: 'auto' }}
      data-testid="component-picker"
    >
      <Grid
        container
        rowSpacing={2}
        columnSpacing={3}
        sx={{ paddingX: 2, paddingY: 4 }}
      >
        {COMPONENTS.map((component) => (
          <Grid item xs={4} key={component}>
            {renderComponent(component)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
