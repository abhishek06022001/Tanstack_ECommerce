import { Button } from "@/components/ui/button";
import { CartContext } from "@/main";

import { ProductCardtype } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {}

function ViewProduct({}: Props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInput = useRef<HTMLInputElement>(null);
    const { id } = useParams();
    const ac_token = localStorage.getItem('accessToken');
    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', id],
        queryFn: () => {
            return axios.get(`/api/get_product/${id}`, {
                headers: {
                    token: ac_token
                }
            });
        },
    })
    if (isLoading) {
        return <div>loading . . . </div>
    }
    if (isError) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        // navigate('/login');
    }
    const product_info: ProductCardtype = data?.data.msg;
    const moveBack = () => {
        navigate(-1);
    }
    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const item = cart.find(prod => prod.product == product_info.id);

  return (
    <div className="flex flex-col justify-center items-center p-10 "> 
          {product_info.image &&
              <div
                  className="bg-white rounded-sm p-4 flex justify-center " >
                  <img className={`md:h-96 h-24`} src={"http://localhost:8080/" + product_info.image} alt="" />
              </div>}
          <div className="text-xl">{product_info.name}</div>
          <div className="text-lg" >${product_info.price}</div>
          <div className="min-w-96">{product_info.description}</div>
          <div className="flex gap-5 bg-secondary text-secondary-foreground p-5 m-10 " >

            <Button
                  onClick={() => addToCart(product_info.id)} 
              >+</Button> {item?.quantity || 0} 
              
            <Button
            onClick={()=>removeFromCart(product_info.id)}
            >-</Button>
          </div>

    </div>
  )
}

export default ViewProduct