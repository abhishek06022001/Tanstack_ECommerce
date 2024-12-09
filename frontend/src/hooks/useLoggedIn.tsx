import axios from "axios";
import { useEffect, useState } from "react"

type Props = {}
function useLoggedIn() {
    const [valid, setIsValid] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(true);
    useEffect(() => {
        async function CheckisValid() {
            // make a call to api with the header and check if accessToken has expired or not ???
            const token = localStorage.getItem('accessToken');
            try {
                const bool = await axios.get('/api/test', {
                    headers: {
                        token: token
                    }
                });
                setIsValid(bool.data.valid);
                setLoading(false);
            } catch (error) {
                setIsValid(false);
                setLoading(false);
            }

        };
        CheckisValid();
    }, [])
    return [valid, loading];
}

export default useLoggedIn