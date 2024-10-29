import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App.jsx';
import Login from './Login.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    }, {
        path: "/login",
        element: <Login />
    }
]);

export default function Navigation() {
    return(
        <RouterProvider router={router}/>        
    );
}