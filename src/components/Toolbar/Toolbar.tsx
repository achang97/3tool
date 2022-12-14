import React, { memo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { GeneralToolbar } from './GeneralToolbar';
import { ToolViewerToolbar } from './ToolViewerToolbar';
import { ToolEditorToolbar } from './ToolEditorToolbar';

export const Toolbar = memo(() => {
  const { isAuthenticated } = useAuth0();
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  if (pathname.startsWith('/tools')) {
    return <ToolViewerToolbar />;
  }

  if (pathname.startsWith('/editor')) {
    return <ToolEditorToolbar />;
  }

  return <GeneralToolbar />;
});
