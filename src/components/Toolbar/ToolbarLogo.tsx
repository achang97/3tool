import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import logo from 'resources/images/logo.svg';
import { Routes } from 'routing/routes';

export const ToolbarLogo = memo(() => {
  return (
    <Link to={Routes.Tools}>
      <img src={logo} alt="ACA Labs logo" />
    </Link>
  );
});
