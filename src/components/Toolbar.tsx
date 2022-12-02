import React, { memo } from 'react';
import { Box, Link } from '@mui/material';
import { Routes } from 'routing/routes';
import { ConnectWallet } from './ConnectWallet';

const LINKS = [
  { href: Routes.Root, text: 'Editor' },
  { href: Routes.ContractLibrary, text: 'Contract Library' },
];

export const Toolbar = memo(() => {
  return (
    <Box sx={{ display: 'flex' }}>
      {LINKS.map(({ href, text }) => (
        <Link key={href} href={href} sx={{ mx: 1, p: 1 }}>
          {text}
        </Link>
      ))}
      <ConnectWallet />
    </Box>
  );
});
