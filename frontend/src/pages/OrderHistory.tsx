import { OrderType } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Props = {}
function OrderHistory({ }: Props) {
    const user_string = localStorage.getItem('user');
    const queryClient = useQueryClient();
    const ac_token = localStorage.getItem('accessToken');
    const user_obj = user_string ? JSON.parse(user_string) : null;
    const id = user_obj?.id;
    const { data, isLoading, isError } = useQuery({
        queryKey: ['order_history', { id }],
        queryFn: () => {
            return axios.get(`/api/get_orders/${id}`, {
                headers: {
                    token: ac_token
                }
            });
        },
    });
    if (isLoading) {
        return <div>Loading</div>
    };
    if (isError) {
        return <div>Error found</div >
    }
    console.log("The data found is", data?.data.msg);
    return (
        <div className='flex flex-col justify-center items-center mx-auto w-3/5 p-5'>
            <h1 className="text-3xl p-10" >ORDER HISTORY </h1>
            <div>
                {/* Header Row */}
                {data?.data.msg.length === 0 ? <>No Orders Placed yet </> : <div className="grid grid-cols-3 gap-4  p-4 rounded-t-xl">

                    <div className="flex justify-center items-center font-bold">PRODUCT NAME</div>
                    <div className="flex justify-center items-center font-bold">PRODUCT PRICE</div>
                    <div className="flex justify-center items-center font-bold">PRODUCT QUANTITY</div>
                </div> }
                {
                    data?.data.msg.map((order_set: OrderType[], setIndex: number) => {
                        let order_total = 0;
                        return <div className="border-b   last:border-b-0">

                            {order_set &&
                                order_set.map((order: OrderType, index: number) => {
                                    order_total += order.product_price_at_order * order.quantity;
                                    return <div
                                        key={index}
                                        className="grid grid-cols-3 gap-4 p-3"
                                    >

                                        <div className="flex justify-center items-center">
                                            {order.product_name}
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {order.product_price_at_order}
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {order.quantity}
                                        </div>
                                    </div>
                                }

                                )
                            }
                            {order_set &&
                                <div
                                    className="p-1 text-end   ">
                                    TOTAL AMOUNT PAID : ${order_total}
                                </div>
                            }
                        </div>
                    })
                }

            </div>

        </div>
    )
}

export default OrderHistory