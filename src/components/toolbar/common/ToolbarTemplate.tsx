import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import logo from '@app/resources/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { ToolbarSection } from './ToolbarSection';

type ToolbarTemplateProps = {
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
  testId?: string;
};

export const ToolbarTemplate = ({ left, middle, right, testId }: ToolbarTemplateProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        height: '60px',
        flexShrink: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        paddingX: 1,
      }}
      data-testid={testId}
    >
      <ToolbarSection sx={{ justifyContent: 'flex-start' }}>
        <Box sx={{ mr: 1 }}>
          <Link href="/" data-testid="toolbar-logo">
            <Image src={logo} alt="3Tool logo" style={{ height: '40px', width: 'auto' }} />
          </Link>
        </Box>
        {left}
      </ToolbarSection>
      <ToolbarSection sx={{ justifyContent: 'center' }}>{middle}</ToolbarSection>
      <ToolbarSection sx={{ justifyContent: 'flex-end' }}>{right}</ToolbarSection>
    </Stack>
  );
};
