import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { Typography } from '@mui/material';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';

export const CanvasText = ({ name }: BaseCanvasComponentProps) => {
  const { evalDataValues } = useComponentEvalData<ComponentType.Text>(name);

  return (
    <Typography
      data-testid="canvas-text"
      sx={{
        textAlign: evalDataValues.horizontalAlignment,
        wordBreak: 'break-word',
      }}
    >
      {evalDataValues.value}
    </Typography>
  );
};
