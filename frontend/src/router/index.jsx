import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Flights from "../pages/Flights";
import MyFlights from "../pages/MyFlights";
import ErrorPage from "../pages/ErrorPage";
import RootLayout from "../layouts/RootLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Payment from "../pages/Payment";
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import FlightManagement from '../components/admin/FlightManagement';
import ReservationManagement from '../components/admin/ReservationManagement';
import Statistics from '../components/admin/Statistics';
import Settings from '../components/admin/Settings';

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
                    },
                    {
                        path: "my-flights",
                        element: <MyFlights />,
                    },
                    {
                        path: "payment/:flightId",
                        element: <Payment />,
                    },
                    // Admin routes
                    {
                        path: "admin",
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <Dashboard /> },
                            { path: "users", element: <UserManagement /> },
                            { path: "flights", element: <FlightManagement /> },
                            { path: "reservations", element: <ReservationManagement /> },
                            { path: "statistics", element: <Statistics /> },
                            { path: "settings", element: <Settings /> }
                        ]
                    }
                ]
            }
        ],
    },
]);

export default router;
