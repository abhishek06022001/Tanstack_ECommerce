import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Product } from "@/types"
import { Button } from "./ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAppSelector } from "@/hooks/hooks"
import { Link } from "react-router-dom"
import axios from "axios"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ProductCard({ id, description, name, price, image }: Product) {
    const { role } = useAppSelector(state => state.users_store_reducer);
    return (
        <div>
            <ToastContainer />
            <Card className="bg-orange-300 rounded-none h-96  flex-1 w-96" >
                <CardHeader>
                    <CardTitle
                    >
                        <p
                            className="bg-white rounded-sm p-4 flex justify-center
                            hover:shadow-amber-600 hover:shadow-lg
                            "
                        > <img
                                className={`md:h-40 h-24`}
                                src={"http://localhost:8080/" + image} alt="" /></p>
                    </CardTitle>

                </CardHeader>
                <CardContent
                    className=" h-3 overflow-hidden text-ellipsis my-1 text-lg font-semibold"
                >
                    {name}
                </CardContent>
                <CardContent
                    className=" h-9 overflow-hidden text-ellipsis my-1 "
                >
                    {description}
                </CardContent>
                <CardFooter className=" block" >
                    <p className="text-xl font-bold text-orange-900" >

                        The Price is  : {price}
                    </p>
                    <div className="flex gap-1">
                        {
                            role ?
                                <div className="flex gap-1">

                                    <Link to={`/edit_product/${id}`}>
                                        <Button
                                            className=" rounded-none"
                                        >

                                            Edit Product
                                        </Button>
                                    </Link>
                                    <AlertDialog >
                                        <AlertDialogTrigger><Button
                                            className=" rounded-none"
                                        >Delete Product</Button></AlertDialogTrigger>
                                        <AlertDialogContent className="bg-orange-100 sm:rounded-none " >
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-orange-800" >
                                                    This action cannot be undone. This will permanently delete your product
                                                    and remove it from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="sm:rounded-none">Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="sm:rounded-none">Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                :
                                <Link to={`/product/${id}`}>
                                    <Button
                                        className=" rounded-none"
                                    >
                                        View Product


                                    </Button>
                                </Link>
                        }
                    </div>
                </CardFooter>

            </Card>
            {/* alert dialog for delete  */}



        </div>
    )
}

export default ProductCard