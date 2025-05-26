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
import AddFlight from "../components/admin/AddFlight";
import AddUser from '../components/admin/AddUser';
import LandingPage from '../pages/LandingPage';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            // Rutas públicas
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "flights",
                element: <Flights />,
            },
            // Rutas protegidas
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "home",
                        element: <Home />,
                    },
                    {
                        path: "my-flights",
                        element: <MyFlights />,
                    },
                    {
                        path: "payment/:flightId",
                        element: <Elements stripe={stripePromise}>
                            <Payment />
                        </Elements>,
                    },
                    // Admin routes
                    {
                        path: "admin",
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <Dashboard /> },
                            { path: "users", element: <UserManagement /> },
                            { path: "users/new", element: <AddUser /> },
                            { path: "flights", element: <FlightManagement /> },
                            { path: "reservations", element: <ReservationManagement /> },
                            { path: "statistics", element: <Statistics /> },
                            { path: "settings", element: <Settings /> },
                            { path: "flights/new", element: <AddFlight /> },
                        ]
                    }
                ]
            }
        ],
    },
]);

export default router;
