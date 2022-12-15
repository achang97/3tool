import React, { memo, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from 'resources/images/logo.svg';
import { Routes } from 'routing/routes';

type ToolbarTemplateProps = {
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
  testId?: string;
};

type ToolbarSectionProps = {
  sx?: BoxProps['sx'];
  children: ReactNode;
};

const ToolbarSection = memo(({ sx, children }: ToolbarSectionProps) => {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', ...sx }}>
      {children}
    </Box>
  );
});

export const ToolbarTemplate = memo(
  ({ left, middle, right, testId }: ToolbarTemplateProps) => {
    return (
      <Box
        sx={{
          height: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        data-testid={testId}
      >
        <ToolbarSection sx={{ justifyContent: 'flex-start' }}>
          <Box sx={{ mr: 1 }}>
            <Link to={Routes.Tools}>
              <img src={logo} alt="ACA Labs logo" data-testid="toolbar-logo" />
            </Link>
          </Box>
          {left}
        </ToolbarSection>
        <ToolbarSection sx={{ justifyContent: 'center' }}>
          {middle}
        </ToolbarSection>
        <ToolbarSection sx={{ justifyContent: 'flex-end' }}>
          {right}
        </ToolbarSection>
      </Box>
    );
  }
);
