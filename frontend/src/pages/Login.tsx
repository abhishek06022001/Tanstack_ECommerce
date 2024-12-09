import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useIsValid from "@/hooks/useIsValid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { BounceLoader } from 'react-spinners';
import { Terminal } from "lucide-react";
import { store } from "@/store/store";
import { logUser } from "@/features/userSlice";
import { useAppDispatch } from "@/hooks/hooks";
type Props = {}
type InputProp = {
    email: string,
    password: string
}
type jwtDecodeProp = {
    id: number
}
function Login({ }: Props) {
    const [input, setInput] = useState<InputProp>({
        email: '', password: ''
    });
    const dispatch = useAppDispatch();
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput({ ...input, [e.currentTarget.name]: e.currentTarget.value });
    };
    const [alert, setAlert] = useState<string | null>(null);
    const [valid] = useIsValid();
    const navigate = useNavigate();
    async function SubmitForm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const ac_token = await axios.post('/api/login', input);
            localStorage.setItem('accessToken', ac_token.data.message);
            const { id } = jwtDecode<jwtDecodeProp>(ac_token.data.message);
            const user_info = await axios.get('/api/get_user/' + id, {
                headers: {
                    token: ac_token.data.message
                }
            });
            user_info.data = { ...user_info.data[0], id: id };
            dispatch(logUser(user_info.data))
            setInput({ email: '', password: '' });
            setAlert("true");
            setTimeout(() => {
                navigate('/');
            }, 2000)

        } catch (error) {
            setAlert("false");
            setTimeout(() => {
                setAlert(null);
            }, 2000)
        }
    }
    return (
        <div className="h-screen flex justify-center items-center p-10 ">
            {(alert == 'true') &&
                <div className="absolute top-10 right-2" >
                    <Alert className="bg-green-500/45 w-72" >
                        <AlertTitle> SuccessFul Login! </AlertTitle>
                    </Alert>
                </div>
            }
            {(alert == 'false') &&
                <div className="absolute top-10 right-2" >
                    <Alert className="bg-red-500/50 w-72" >
                        <AlertTitle> Please Enter correct details ... </AlertTitle>
                    </Alert>
                </div>
            }
            {valid.loading ?
                <div><BounceLoader color="orange" /></div>
                : (valid.valid ?
                    <Navigate to="/" />
                    : <div className="w-96 h-96 rounded-lg bg-slate-150 border-r-4 border-l-4 border-orange-500 
            text-center p-10 flex flex-col justify-between" >
                        <h1 className="text-3xl font-mono font-extrabold  " >Login Page</h1>
                        <Input type="email" placeholder="Email" className="bg-orange-100" name="email" onChange={(e) => handleChange(e)} value={input.email} />
                        <Input type="password" placeholder="Password" className="bg-orange-100" name="password" onChange={(e) => handleChange(e)} value={input.password} />
                        <Button onClick={(e) => SubmitForm(e)} >Login In</Button>
                        <Link to={'/signup'}>
                            <Button className="w-full">
                                New Here ? Sign up
                            </Button>
                        </Link></div>)}
        </div>
    )
}
export default Login