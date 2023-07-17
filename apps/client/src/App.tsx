import * as React from 'react';
import './App.css';
import { UserContextProvider }  from './contexts/UserContext';
import { AuthContextProvider } from './contexts/AuthContext';
import { SnackbarContextProvider } from './contexts/SnackbarContext';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import UsersPage from './pages/UsersPage';
import AuthPage from './pages/AuthPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
]);

function App() {
  return (
    <>
    <SnackbarContextProvider>
      <AuthContextProvider>
        <UserContextProvider >
          <RouterProvider router={router} />
        </UserContextProvider>
      </AuthContextProvider>
    </SnackbarContextProvider>
    </>
  )
}

export default App;
