import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './components/Login';

const router = createBrowserRouter([
 {
  path: "/",
  element: <App />,
  children: [
    { path: "login", element: <Login /> },

    {
      element: <ProtectedRoute />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "purchases", element: <Purchases /> },
        { path: "transfers", element: <Transfers /> },
        { path: "assignments", element: <Assignments /> },
      ],
    },
  ],
}

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
