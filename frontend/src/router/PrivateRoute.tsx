
import React from 'react'
import { Navigate } from 'react-router-dom';
type Props = {
    children: React.ReactNode;
}
function PrivateRoute({ children }: Props) {
    const token = localStorage.getItem('accessToken');
    return (
        <>
            {token ? <>{children}</> : <Navigate to="/login" />}
        </>
    )
}
export default PrivateRoute