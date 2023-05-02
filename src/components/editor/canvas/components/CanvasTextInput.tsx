import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { TextField } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';
import { useComponentInputs } from '../../hooks/useComponentInputs';

export const CanvasTextInput = ({ name, eventHandlerCallbacks }: BaseCanvasComponentProps) => {
  const dispatch = useAppDispatch();
  const input = useComponentInputs<ComponentType.TextInput>(name);
  const { evalDataValues } = useComponentEvalData<ComponentType.TextInput>(name);

  const handleUpdateValue = useCallback(
    (newValue: string | undefined) => {
      dispatch(setComponentInput({ name, input: { value: newValue } }));
    },
    [dispatch, name]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleUpdateValue(e.target.value);
    },
    [handleUpdateValue]
  );

  const errorText = useMemo(() => {
    if (input.value === undefined) {
      return '';
    }

    if (input.value === '' && evalDataValues.required) {
      return 'Input is required';
    }

    if (
      typeof evalDataValues.minLength === 'number' &&
      input.value.length < evalDataValues.minLength
    ) {
      return `Input must be at least ${evalDataValues.minLength} character(s)`;
    }

    if (
      typeof evalDataValues.maxLength === 'number' &&
      input.value.length > evalDataValues.maxLength
    ) {
      return `Input must be at most ${evalDataValues.maxLength} character(s)`;
    }

    return '';
  }, [evalDataValues.maxLength, evalDataValues.minLength, evalDataValues.required, input.value]);

  /**
   * Side effects
   */
  useEffect(() => {
    // We want to unset the value to undefined when the defaultValue is the empty string
    handleUpdateValue(evalDataValues.defaultValue || undefined);
  }, [evalDataValues.defaultValue, handleUpdateValue]);

  return (
    <TextField
      data-testid="canvas-text-input"
      label={evalDataValues.label}
      value={input.value ?? evalDataValues.defaultValue}
      placeholder={evalDataValues.placeholder}
      disabled={evalDataValues.disabled}
      required={evalDataValues.required}
      inputProps={{
        minLength: evalDataValues.minLength,
        maxLength: evalDataValues.maxLength,
      }}
      onChange={handleChange}
      error={!!errorText}
      helperText={errorText}
      {...eventHandlerCallbacks}
    />
  );
};
