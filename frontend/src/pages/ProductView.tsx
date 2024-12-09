import { logoutUser } from '@/features/userSlice';
import { useAppDispatch } from '@/hooks/hooks';
import { ProductType } from '@/types';
import axios from 'axios';
import { Badge } from "@/components/ui/badge"

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type Props = {}
function ProductView({ }: Props) {
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductType>({
        information: {
            description: '',
            name: '',
            id: null,
            price: null,
            image: '',
            category: "none"
        },
        loading: true
    });
    const dispatch = useAppDispatch();
    const ac_token = localStorage.getItem('accessToken');
    const { id } = useParams();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`/api/get_product/${id}`, {
                    headers: {
                        token: ac_token
                    }
                });
                const fetched_product_ = {
                    information: response.data.msg, loading: false
                };
                setProduct(fetched_product_);
            } catch (error) {
                dispatch(logoutUser());
                setProduct({ ...product, loading: true })
                setTimeout(() => {
                    navigate('/login');
                }, 1000)
            }
        };
        fetchProduct();
    }, [id])
    return (
        <div className='flex justify-center items-center h-full  gap-10 p-20'>
            <div>
                <img
                    className=' w-[550px] rounded-xl '
                    src={"http://localhost:8080/" + product.information.image} alt="" />
            </div>
            <div>
                <div  className='text-4xl font-extrabold text-orange-600' >{product.information.name}</div>
                <div className='text-xl font-sans text-orange-950 m-1' >{product.information.description}</div>
                <div className='text-xl text-black m-1' >${product.information.price}</div>
                <Badge className='text-lg'>{product.information.category}</Badge>
                
            </div>
        </div>
    )
}

export default ProductView