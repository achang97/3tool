import { TextField, Typography } from '@mui/material';
import type { TextFieldProps, TypographyProps } from '@mui/material';
import {
  ChangeEvent,
  useCallback,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';

export type EditableTextFieldProps = {
  value: string;
  editable?: boolean;
  onSubmit?: (newTextField: string) => void;
  TextFieldProps?: TextFieldProps;
  TypographyProps?: TypographyProps;
};

export const EditableTextField = ({
  value,
  onSubmit,
  editable = true,
  TextFieldProps,
  TypographyProps,
}: EditableTextFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(() => {
    setIsEditing(false);

    if (value === localValue) {
      return;
    }

    setLocalValue(value);
    onSubmit?.(localValue);
  }, [onSubmit, localValue, value]);

  const handleInputBlur = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  if (isEditing && editable) {
    return (
      <TextField
        value={localValue}
        onChange={handleInputChange}
        fullWidth
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        autoFocus
        onClick={handleToggleEditMode}
        inputProps={{
          'data-testid': 'editable-text-field-edit',
        }}
        {...TextFieldProps}
      />
    );
  }

  return (
    <Typography
      {...TypographyProps}
      onClick={handleToggleEditMode}
      data-testid="editable-text-field-view"
      sx={{ ...TypographyProps?.sx, cursor: editable ? 'pointer' : 'initial' }}
    >
      {value}
    </Typography>
  );
};
