import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import App from './App.jsx';
import Login from './pages/Login/Login.tsx';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Register/Register.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Prototype1 from './pages/Prototype/Prototype1.jsx';
import Prototype2 from './pages/Prototype/Prototype2.jsx';
import Prototype3 from './pages/Prototype/Prototype3.jsx';
import About from './pages/About/About.jsx';

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
        path: "/prototype1",
        element: <Prototype1 />
    },
    {
        path: "/prototype2",
        element: <Prototype2/>
    },
    {
        path: "/prototype3",
        element: <Prototype3/>
    }
]);

export default function Navigation() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router}/>        
        </Suspense>   
    );
}