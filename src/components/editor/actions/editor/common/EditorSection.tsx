import { HelpTooltip } from '@app/components/common/HelpTooltip';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Collapse, IconButton, Switch, Typography } from '@mui/material';
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';

type EditorSectionProps = {
  title: string;
  tooltip?: string;
  children: ReactNode;
  isEnabledToggleable?: boolean;
  isEnabled?: boolean;
  onToggleEnabled?: (isEnabled: boolean) => void;
  testId?: string;
};

export const EditorSection = ({
  title,
  tooltip,
  children,
  isEnabled = false,
  isEnabledToggleable,
  onToggleEnabled,
  testId,
}: EditorSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const isToggleable = useMemo(() => {
    return !isEnabledToggleable || isEnabled;
  }, [isEnabled, isEnabledToggleable]);

  const handleToggleSection = useCallback(() => {
    if (!isToggleable) {
      return;
    }
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, [isToggleable]);

  const handleToggleEnabled = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onToggleEnabled?.(e.target.checked);
      setIsOpen(e.target.checked);
    },
    [onToggleEnabled]
  );

  const isVisible = useMemo(() => {
    return isOpen && isToggleable;
  }, [isOpen, isToggleable]);

  return (
    <Box data-testid={testId}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 1,
          marginX: -1,
          paddingX: 1,
          cursor: isToggleable ? 'pointer' : 'auto',
          backgroundColor: 'greyscale.offwhite.main',
          borderRadius: 1,
        }}
        onClick={handleToggleSection}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isEnabledToggleable && (
            <Switch checked={isEnabled} onChange={handleToggleEnabled} size="small" />
          )}
          <Typography variant="subtitle2" color="text.tertiary">
            {title}
          </Typography>
          {tooltip && <HelpTooltip text={tooltip} />}
        </Box>
        <IconButton
          size="small"
          sx={{
            color: 'text.tertiary',
            visibility: isToggleable ? 'visible' : 'hidden',
          }}
        >
          {isVisible ? (
            <ArrowDropUp data-testid="editor-section-arrow-up" />
          ) : (
            <ArrowDropDown data-testid="editor-section-arrow-down" />
          )}
        </IconButton>
      </Box>
      <Collapse in={isVisible}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 1,
            gap: 1,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};
