import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';
import { useComponentInputs } from '../../hooks/useComponentInputs';

export const CanvasNumberInput = ({
  name,
  eventHandlerCallbacks,
}: BaseCanvasComponentProps) => {
  const dispatch = useAppDispatch();
  const input = useComponentInputs<ComponentType.NumberInput>(name);
  const { evalDataValues } =
    useComponentEvalData<ComponentType.NumberInput>(name);

  const handleUpdateValue = useCallback(
    (newValue: number) => {
      dispatch(setComponentInput({ name, input: { value: newValue } }));
    },
    [dispatch, name]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleUpdateValue(parseFloat(e.target.value));
    },
    [handleUpdateValue]
  );

  const errorText = useMemo(() => {
    if (input.value === undefined) {
      return '';
    }

    if (Number.isNaN(input.value) && evalDataValues.required) {
      return 'Input is required';
    }

    if (
      typeof evalDataValues.minimum === 'number' &&
      input.value < evalDataValues.minimum
    ) {
      return `Input must be at least ${evalDataValues.minimum}`;
    }

    if (
      typeof evalDataValues.maximum === 'number' &&
      input.value > evalDataValues.maximum
    ) {
      return `Input must be at most ${evalDataValues.maximum}`;
    }

    return '';
  }, [
    input.value,
    evalDataValues.required,
    evalDataValues.minimum,
    evalDataValues.maximum,
  ]);

  /**
   * Side effects
   */
  useEffect(() => {
    if (evalDataValues.defaultValue) {
      handleUpdateValue(evalDataValues.defaultValue);
    }
  }, [evalDataValues.defaultValue, handleUpdateValue]);

  return (
    <TextField
      data-testid="canvas-number-input"
      type="number"
      label={evalDataValues.label}
      value={Number.isNaN(input.value) ? undefined : input.value}
      defaultValue={evalDataValues.defaultValue}
      placeholder={evalDataValues.placeholder}
      disabled={evalDataValues.disabled}
      required={evalDataValues.required}
      inputProps={{
        min: evalDataValues.minimum,
        max: evalDataValues.maximum,
      }}
      onChange={handleChange}
      error={!!errorText}
      helperText={errorText}
      {...eventHandlerCallbacks}
    />
  );
};
