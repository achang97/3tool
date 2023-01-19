import { Grid } from '@mui/material';
import { ComponentType } from '@app/types';
import Image from 'next/image';
import { useCallback } from 'react';
import { COMPONENTS_BY_TYPE } from '@app/constants';
import { DraggableComponent } from './components/DraggableComponent';

const COMPONENTS = [
  ComponentType.Button,
  ComponentType.TextInput,
  ComponentType.NumberInput,
  ComponentType.Select,
  ComponentType.Container,
  ComponentType.Text,
  ComponentType.Table,
];

export const ComponentPicker = () => {
  const renderComponent = useCallback((type: ComponentType) => {
    const { label, icon } = COMPONENTS_BY_TYPE[type];
    return (
      <Grid item xs={4} key={label}>
        <DraggableComponent
          label={label}
          icon={<Image alt={label} src={icon} />}
          type={type}
        />
      </Grid>
    );
  }, []);

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={3}
      sx={{ paddingX: 2, paddingY: 4 }}
      data-testid="component-picker"
    >
      {COMPONENTS.map(renderComponent)}
    </Grid>
  );
};
