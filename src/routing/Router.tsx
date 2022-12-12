import React, { memo, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ToolEditor } from 'pages/ToolEditor/ToolEditor';
import { FullscreenLoader } from 'components/common/FullscreenLoader';
import { ToolViewer } from 'pages/ToolViewer/ToolViewer';
import { Tools } from 'pages/Tools/Tools';
import { ResourceSettings } from 'pages/ResourceSettings/ResourceSettings';
import { Resources } from 'pages/Resources/Resources';
import { Settings } from 'pages/Settings/Settings';
import { Routes } from './routes';
import { Layout } from './Layout';

export const Router = memo(() => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const router = useMemo(() => {
    if (!isAuthenticated) {
      return createBrowserRouter([
        {
          element: <Layout />,
          children: [
            {
              path: '*',
              element: <FullscreenLoader />,
            },
          ],
        },
      ]);
    }

    return createBrowserRouter([
      {
        element: <Layout />,
        children: [
          {
            path: Routes.Tools,
            element: <Tools />,
          },
          {
            path: Routes.ToolEditor,
            element: <ToolEditor />,
          },
          {
            path: Routes.ToolViewer,
            element: <ToolViewer />,
          },
          {
            path: Routes.Resources,
            element: <Resources />,
          },
          {
            path: Routes.ResourceSettings,
            element: <ResourceSettings />,
          },
          {
            path: Routes.Settings,
            element: <Settings />,
          },
        ],
      },
    ]);
  }, [isAuthenticated]);

  return <RouterProvider router={router} />;
});
