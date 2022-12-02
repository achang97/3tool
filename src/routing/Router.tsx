import React, { memo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Editor } from 'pages/Editor/Editor';
import { ContractLibrary } from 'pages/ContractLibrary/ContractLibrary';
import { Routes } from './routes';

export const router = createBrowserRouter([
  {
    path: Routes.Root,
    element: <Editor />,
  },
  {
    path: Routes.ContractLibrary,
    element: <ContractLibrary />,
  },
]);

export const Router = memo(() => {
  return <RouterProvider router={router} />;
});
