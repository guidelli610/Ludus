import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import App from './App.jsx';
import Login from './pages/Login/Login.js';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Prototype from './pages/Prototype/Prototype.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/home",
        element: <Home />
    }, 
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/prototype",
        element: <Prototype />
    }
]);

export default function Navigation() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router}/>        
        </Suspense>   
    );
}