import { useAppSelector } from "@/hooks/hooks";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactElement
}
function ProtectedRoute({ children }: Props) {
    const { role } = useAppSelector(state => state.users_store_reducer);
    const token = localStorage.getItem('accessToken');
    return (
        <>
            {token ? <>{role ? <>{children}</> : <Navigate to="/login" />}</> : <Navigate to="/login" />}
        </>
    )
}

export default ProtectedRoute