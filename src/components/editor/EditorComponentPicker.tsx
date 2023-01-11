import { Grid } from '@mui/material';
import { ComponentType } from '@app/types';
import Image from 'next/image';
import buttonIcon from '@app/resources/icons/button.svg';
import textInputIcon from '@app/resources/icons/text-input.svg';
import numberInputIcon from '@app/resources/icons/number-input.svg';
import containerIcon from '@app/resources/icons/container.svg';
import textIcon from '@app/resources/icons/text.svg';
import tableIcon from '@app/resources/icons/table.svg';
import selectIcon from '@app/resources/icons/select.svg';
import { EditorDraggable } from './EditorDraggable';

const COMPONENTS = [
  {
    label: 'Button',
    icon: buttonIcon,
    type: ComponentType.Button,
  },
  {
    label: 'Text Input',
    icon: textInputIcon,
    type: ComponentType.TextInput,
  },
  {
    label: 'Number Input',
    icon: numberInputIcon,
    type: ComponentType.NumberInput,
  },
  {
    label: 'Select',
    icon: selectIcon,
    type: ComponentType.Select,
  },
  {
    label: 'Container',
    icon: containerIcon,
    type: ComponentType.Container,
  },
  {
    label: 'Text',
    icon: textIcon,
    type: ComponentType.Text,
  },
  {
    label: 'Table',
    icon: tableIcon,
    type: ComponentType.Table,
  },
];

export const EditorComponentPicker = () => {
  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={3}
      sx={{ paddingX: 2, paddingY: 4 }}
      data-testid="editor-component-picker"
    >
      {COMPONENTS.map((component) => (
        <Grid item xs={4} key={component.label}>
          <EditorDraggable
            label={component.label}
            icon={<Image alt={component.label} src={component.icon} />}
            componentType={component.type}
          />
        </Grid>
      ))}
    </Grid>
  );
};
