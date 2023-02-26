import { Box, TextField, Tooltip, Typography } from '@mui/material';
import type { TextFieldProps, TypographyProps } from '@mui/material';
import {
  ChangeEvent,
  useCallback,
  useState,
  KeyboardEvent,
  useEffect,
  useMemo,
} from 'react';
import { useIsHovered } from '@app/hooks/useIsHovered';
import { Edit, EditOff } from '@mui/icons-material';
import _ from 'lodash';
import { lineClamp } from '@app/utils/mui';

export type EditableTextFieldProps = {
  value: string;
  isEditable?: boolean;
  showIcon?: boolean;
  iconTooltip?: string;
  onSubmit?: (newTextField: string) => void;
  height?: number;
  TextFieldProps?: TextFieldProps;
  TypographyProps?: TypographyProps;
};

export const EditableTextField = ({
  value,
  onSubmit,
  isEditable = true,
  showIcon,
  iconTooltip,
  height,
  TextFieldProps,
  TypographyProps,
}: EditableTextFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const { isHovered, onMouseEnter, onMouseLeave } = useIsHovered();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleToggleEditMode = useCallback(() => {
    if (!isEditable) {
      return;
    }
    setIsEditing(true);
  }, [isEditable]);

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

  const isTextField = useMemo(() => {
    return isEditing && isEditable;
  }, [isEditing, isEditable]);

  const hoverIcon = useMemo(() => {
    const HoverIcon = isEditable ? Edit : EditOff;
    const testId = isEditable
      ? 'editable-text-field-edit-icon'
      : 'editable-text-field-disabled-icon';

    return (
      <Tooltip title={iconTooltip}>
        <HoverIcon
          fontSize="inherit"
          data-testid={testId}
          sx={{
            visibility: isHovered && showIcon ? 'visible' : 'hidden',
            position: 'absolute',
            right: '3px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </Tooltip>
    );
  }, [iconTooltip, isEditable, isHovered, showIcon]);

  return (
    <Box
      sx={{ minWidth: 0, flex: 1 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isTextField && (
        <TextField
          value={localValue}
          onChange={handleInputChange}
          fullWidth
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
          onClick={handleToggleEditMode}
          data-testid="editable-text-field-edit"
          inputProps={{}}
          sx={{ height, ...TextFieldProps?.sx }}
          {...TextFieldProps}
        />
      )}
      {!isTextField && (
        <Typography
          {...TypographyProps}
          onClick={handleToggleEditMode}
          data-testid="editable-text-field-view"
          sx={_.merge(
            {
              height,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              cursor: isEditable ? 'pointer' : 'inherit',
              borderRadius: '4px',
              padding: 0.25,
              ':hover': {
                backgroundColor:
                  isHovered && isEditable
                    ? 'greyscale.offwhite.main'
                    : 'inherit',
              },
            },
            TypographyProps?.sx
          )}
        >
          <Typography
            fontSize="inherit"
            variant="inherit"
            component="span"
            sx={{
              ...lineClamp(1),
              opacity: isHovered && isEditable ? 0.5 : 1,
            }}
          >
            {value}
          </Typography>
          {hoverIcon}
        </Typography>
      )}
    </Box>
  );
};
