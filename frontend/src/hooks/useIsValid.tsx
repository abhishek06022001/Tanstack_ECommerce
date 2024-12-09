import { useEffect, useState } from "react"
import axios from "axios";
type ValidProp = {
    valid: Boolean, loading: Boolean
}
function useIsValid() {
    const [valid, setIsValid] = useState<ValidProp>({ valid: false, loading: true });
    const token = localStorage.getItem('accessToken') || null;
    useEffect(() => {
        async function CheckIsValid() {
            try {
                const bool = await axios.get('/api/test', {
                    headers: {
                        token: token
                    }
                });
                setTimeout(() => {
                    setIsValid({ valid: bool.data.valid, loading: false });
                }, 1500)

            } catch (error) {
                localStorage.removeItem('accessToken');
                setTimeout(() => {
                    setIsValid({ valid: false, loading: false });
                }, 1500)

            }
        };
        CheckIsValid();
    }, [token]);
    return (
        [valid]
    )
}

export default useIsValid