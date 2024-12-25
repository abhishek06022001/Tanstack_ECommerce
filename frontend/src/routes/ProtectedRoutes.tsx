import React, { Children } from 'react'
import { Navigate } from "react-router-dom";
type Props = {
    children: React.ReactNode
}
function ProtectedRoutes({ children }: Props) {
    const ac_token = localStorage.getItem('accessToken');
    const user_obj = localStorage.getItem('user');
    const role = user_obj ? JSON.parse(user_obj).role : 0;
    return (
        <div>
            {(ac_token && (role === 1)) ?
                (<>{children}</>)
                : <Navigate to={'/'} />}
        </div>
    )
}
export default ProtectedRoutes