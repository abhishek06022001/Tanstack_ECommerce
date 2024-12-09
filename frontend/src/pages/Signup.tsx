import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useIsValid from "@/hooks/useIsValid";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"
import { BounceLoader } from "react-spinners";

type Props = {
   
}
function Signup({ }: Props) {
    const [valid] = useIsValid();
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [input, setInput] = useState<Props>({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput({ ...input, [e.currentTarget.name]: e.currentTarget.value });
    }
    async function signup(e: React.MouseEvent<HTMLInputElement>) {
        e.preventDefault();
        try {
            const response = await axios.post("/api/register", input);
            // setLoading(true);
            setStatusCode(200);
            setTimeout(() => {
                navigate('/login');
            }, 200);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.status == 400) {
                    setStatusCode(409);
                    setTimeout(() => {
                        setStatusCode(null);
                    }, 1000);
                } else {
                    setStatusCode(500);
                    setTimeout(() => {
                        setStatusCode(null);
                    }, 1000)
                    alert("server issue please try again later");
                }
            }
        }

    }
    return (
        <div className="h-screen flex justify-center items-center">
            {(statusCode == 200) &&
                <div className="absolute top-10 right-2" >
                    <Alert className="bg-green-500/45 w-72" >
                        <AlertTitle> SuccessFul Sign up! </AlertTitle>
                    </Alert>
                </div>
            }
            {(statusCode == 409) &&
                <div className="absolute top-10 right-2" >
                    <Alert className="bg-red-500/50 w-72" >
                        <AlertTitle> User already Exists ... </AlertTitle>
                    </Alert>
                </div>
            }
            {(statusCode == 500) &&
                <div className="absolute top-10 right-2" >
                    <Alert className="bg-orange-500/50 w-72" >
                        <AlertTitle> Some server Error please try again ...  </AlertTitle>
                    </Alert>
                </div>
            }
            {valid.loading ? <><BounceLoader color="orange" /></> : <>
                {valid.valid ?
                    <Navigate to="/" />
                    : <><div className="w-96 h-96 rounded-lg 
            border-r-4 border-l-4 border-orange-500  text-center p-10 flex flex-col justify-between" >
                        <h1 className="text-3xl font-mono font-extrabold " >Signup Page</h1>
                        <Input type="name" placeholder="Name" name="name" className="bg-orange-100" onChange={(e) => handleChange(e)} />
                        <Input type="email" placeholder="Email" name="email" className="bg-orange-100" onChange={(e) => handleChange(e)} />
                        <Input type="password" placeholder="Password" name="password" className="bg-orange-100" onChange={(e) => handleChange(e)} />
                        <Button onClick={e => signup(e)} >Sign up</Button>
                        <Link to={'/login'}>
                            <Button className="w-full" ><span className="text-xs font-light">already have an account ?</span> Log in</Button>
                        </Link>
                    </div></>}
            </>}
        </div>
    )
}

export default Signup