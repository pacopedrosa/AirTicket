import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Flights from "../pages/Flights";
import ErrorPage from "../pages/ErrorPage";
import RootLayout from "../layouts/RootLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            // Rutas públicas
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/flights",
                element: <Flights />,
            },
            // Rutas protegidas
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    }
                ]
            }
        ],
    },
]);

export default router;
