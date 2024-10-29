import React from 'react';
import Home from './pages/Home.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    }, {
        path: "/login",
        element: <Login />
    },
    {
        path: "/home",
        element: <Home />
    }
]);

export default function Navigation() {
    return(
        <RouterProvider router={router}/>        
    );
}