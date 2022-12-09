import React, { memo } from 'react';
import { Toolbar } from 'components/Toolbar';
import { Outlet } from 'react-router-dom';

export const Layout = memo(() => {
  return (
    <>
      <Toolbar />
      <Outlet />
    </>
  );
});
