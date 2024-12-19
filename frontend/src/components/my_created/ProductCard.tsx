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
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
export function ProductCard({ product }: ProductCardProps) {
    const { id, name, price, description, image } = product;
    const ac_token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('user_role');
    const queryClient = useQueryClient();
    const deleteProductApi = () => {
        return axios.delete(`/api/delete_product/${id}`, {
            headers: {
                token: ac_token
            }
        });
    }
    const { mutate } = useMutation({
        mutationFn: deleteProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', id] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
    function delete_product() {
        mutate();
    }
    return (
        <div>
            {/* <ToastContainer /> */}
            <Card className="bg-primary-foreground text-primary rounded-none   flex-1 w-80" >
                <CardHeader>
                    <CardTitle
                    >
                        <p
                            className="bg-white rounded-sm p-4 flex justify-center"
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
                                                <AlertDialogAction className="sm:rounded-none"
                                                    onClick={delete_product}
                                                >Continue</AlertDialogAction>
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
