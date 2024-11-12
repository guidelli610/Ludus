import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import App from './App.jsx';
import Login from './pages/Login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Register/Register.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Message from './pages/Message/Message.jsx';
import About from './pages/About/About.jsx';
import Style from './pages/Style/Style.jsx';
import Match from './pages/Match/Match.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

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
        path: "/about",
        element: <About />
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/message",
        element: <Message />
    },
    {
        path: "/style",
        element: <Style />
    }, 
    {
        path: "/match",
        element: <Match />
    },
    {
        path: "/dashboard",
        element: <Dashboard />
    }
]);

export default function Navigation() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router}/>        
        </Suspense>   
    );
}