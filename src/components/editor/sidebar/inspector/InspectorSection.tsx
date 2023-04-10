import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { ReactNode, useCallback, useState } from 'react';

type InspectorSectionProps = {
  title: string;
  children: ReactNode;
};

export const InspectorSection = ({ title, children }: InspectorSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleSection = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  return (
    <Box
      sx={{
        paddingX: 2,
        paddingY: 1,
        '&:not(:first-of-type)': { borderTop: 1, borderColor: 'divider' },
      }}
      data-testid={`inspector-section-${title}`}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 1,
          cursor: 'pointer',
        }}
        onClick={handleToggleSection}
      >
        <Typography variant="subtitle1" color="text.tertiary">
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: 'text.tertiary' }}>
          {isOpen ? (
            <ArrowDropUp data-testid="inspector-section-arrow-up" />
          ) : (
            <ArrowDropDown data-testid="inspector-section-arrow-down" />
          )}
        </IconButton>
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};
