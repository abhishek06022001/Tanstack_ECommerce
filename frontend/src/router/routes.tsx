import ErrorPage from "@/pages/ErrorPage";
import Login from "@/pages/Login";
import ProductPage from "@/pages/ProductPage";
import Signup from "@/pages/Signup";
import LandingPage from "@/pages/Template/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import IndividualProduct from "@/pages/IndividualProduct";
import ProductView from "@/pages/ProductView";
import ProtectedRoute from "./ProtectedRoute";
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
                path: '/edit_product/:id',
                element: <ProtectedRoute><IndividualProduct /></ProtectedRoute>
            },
            {
                path: '/product/:id',
                element: <PrivateRoute><ProductView /></PrivateRoute>
            },
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