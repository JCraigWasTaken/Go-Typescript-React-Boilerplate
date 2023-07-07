import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Box } from '@mui/material';
import './App.scss';
import HomePage from '../pages/HomePage/HomePage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import { RecoilRoot } from 'recoil';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/*',
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <RecoilRoot>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ height: '100vh' }}
      >
        <RouterProvider router={router} />
      </Box>
    </RecoilRoot>
  );
}

export default App;
