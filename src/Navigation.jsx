import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';

const router = createBrowserRouter([
    {
        path: "/App",
        element: <App />
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