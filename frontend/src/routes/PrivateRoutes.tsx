import React, { Children } from 'react'
import { Navigate } from "react-router-dom";
type Props = {
    children: React.ReactNode
}
function PrivateRoutes({ children }: Props ) {
    const ac_token = localStorage.getItem('accessToken');
    return (
        <div>
            {ac_token ?
                <>{children}</>
                : <Navigate to={'/login'} />}
        </div>
    )
}

export default PrivateRoutes