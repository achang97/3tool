import React, { memo, ReactNode } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from 'resources/images/logo.svg';
import { Routes } from 'routing/routes';

type ToolbarTemplateProps = {
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
};

export const ToolbarTemplate = memo(
  ({ left, middle, right }: ToolbarTemplateProps) => {
    return (
      <Box
        sx={{
          height: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
          <Link to={Routes.Tools}>
            <img src={logo} alt="ACA Labs logo" />
          </Link>
          {left}
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
          {middle}
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
          {right}
        </Box>
      </Box>
    );
  }
);
