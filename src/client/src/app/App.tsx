import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Box } from '@mui/material';
import './App.scss';
import HomeContainer from '../pages/HomePage/HomeContainer';
import ErrorContainer from '../pages/ErrorPage/ErrorContainer';
import { RecoilRoot } from 'recoil';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeContainer />,
  },
  {
    path: '/*',
    element: <ErrorContainer />,
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
