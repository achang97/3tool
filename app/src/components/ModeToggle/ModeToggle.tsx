import React, { memo, useCallback } from 'react';
import { Button, useColorScheme } from '@mui/material';

export const ModeToggle = memo(() => {
  const { mode, setMode } = useColorScheme();

  const handleClick = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [setMode, mode]);

  return (
    <Button onClick={handleClick}>{mode === 'light' ? 'Dark' : 'Light'}</Button>
  );
});
