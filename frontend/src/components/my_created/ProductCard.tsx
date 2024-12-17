import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductCardProps, ProductCardtype } from "@/types"
import { Link } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
export function ProductCard({ product }: ProductCardProps) {
    const { id, name, price, description ,image} = product;
    
    const role  = localStorage.getItem('user_role');

    return (
        <div>
            {/* <ToastContainer /> */}
            <Card className="bg-primary-foreground text-primary rounded-none   flex-1 w-80" >
                <CardHeader>
                    <CardTitle
                    >
                        <p
                            className="bg-white rounded-sm p-4 flex justify-center
                            hover:shadow-pink-500 hover:shadow-lg
                            "
                        > <img
                                className={`md:h-32 h-24`}
                                src={"http://localhost:8080/" + image} alt="" /></p>
                    </CardTitle>

                </CardHeader>
                <CardContent
                    className=" h-3 overflow-hidden text-ellipsis my-1  text-md font-semibold"
                >
                    {name}
                </CardContent>
                <CardContent
                    className=" h-7 overflow-hidden text-ellipsis my-1 "
                >
                    {description}
                </CardContent>
                <CardFooter className=" block" >
                    <p className="" >

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
                                        <AlertDialogContent className=" sm:rounded-none " >
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="" >
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
        </div>
    )
}
