import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { LoadingButton } from '@mui/lab';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';

export const CanvasButton = ({ name, eventHandlerCallbacks }: BaseCanvasComponentProps) => {
  const { evalDataValues } = useComponentEvalData<ComponentType.Button>(name);

  return (
    <LoadingButton
      data-testid="canvas-button"
      loading={evalDataValues.loading}
      disabled={evalDataValues.disabled}
      {...eventHandlerCallbacks}
    >
      {evalDataValues.text}
    </LoadingButton>
  );
};
