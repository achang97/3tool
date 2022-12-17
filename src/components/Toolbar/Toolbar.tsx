import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { GeneralToolbar } from './GeneralToolbar';
import { ToolViewerToolbar } from './ToolViewerToolbar';
import { ToolEditorToolbar } from './ToolEditorToolbar';

export const Toolbar = () => {
  const { isAuthenticated } = useAuth0();
  const { pathname } = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  switch (pathname) {
    case '/tools/[id]':
      return <ToolViewerToolbar />;
    case '/editor/[id]':
      return <ToolEditorToolbar />;
    default:
      return <GeneralToolbar />;
  }
};
