import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ErrorPage from "./Pages/ErrorPage";
import LandingPage from "./Pages/LandingPage";
import ProductPage from "./Pages/ProductPage";
import IndividualProduct from "./components/my_created/IndividualProduct";
import ProfilePage from "./Pages/ProfilePage";
import PrivateRoutes from './routes/PrivateRoutes'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Users from "./Pages/Users";
import OrderHistory from "./Pages/OrderHistory";
import ViewProduct from "./Pages/ViewProduct";
import Cart from "./Pages/Cart";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
        children: [
            {
                index: true,
                element: <ProductPage />
            },
            {
                path: '/product/:id',
                element: <PrivateRoutes> <ViewProduct /></PrivateRoutes>
            },
            {
                path: '/edit_product/:id',
                element: <ProtectedRoutes><IndividualProduct /></ProtectedRoutes>
            },
            {
                path: '/users',
                element: <ProtectedRoutes><Users /></ProtectedRoutes>
            },
            {
                path: '/cart',
                element: <PrivateRoutes><Cart /></PrivateRoutes>
            },
            {
                path: '/profile',
                element: <PrivateRoutes><ProfilePage /></PrivateRoutes>
            },
            {
                path:'/order_history',
                element: <PrivateRoutes><OrderHistory /></PrivateRoutes>
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },

    {
        path: '*',
        element: <ErrorPage />
    }
]);