import { CartContext } from '@/main';
import  { useContext } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"


type Props = {}

function Cart({ }: Props) {
    const { addToCart, removeFromCart, cart, clearCart, placeOrder } = useContext(CartContext);

    let total_amount = 0;
    return (
        <div className='p-10  flex flex-col justify-center ' >
            <Table>
                <TableCaption>A list of your cart </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >SR</TableHead>
                        <TableHead>PRODUCT NAME</TableHead>
                        <TableHead>PRODUCT PRICE</TableHead>
                        <TableHead>QUANTITY</TableHead>
                        <TableHead>OPTIONS</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cart.map((item, index) => {
                        console.log("The cart item is ", item);
                        total_amount += item.product.price * item.quantity;
                        return <TableRow>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.product.name}</TableCell>
                            <TableCell>{item.product.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell
                            >
                                <Button
                                    className='mr-5'
                                    onClick={() => addToCart(item.product)}
                                >+</Button>

                                <Button
                                    className='ml-5'
                                    onClick={() => removeFromCart(item.product)}
                                >-</Button>

                            </TableCell>
                            <TableCell className="text-right">$ {item.product.price * item.quantity}</TableCell>
                        </TableRow>
                    })}

                </TableBody>
            </Table>
            <div className='flex justify-end text-xl' >Total payable amount : $ {total_amount}</div>
            <div className='flex gap-10 justify-end mt-10 text-xl' >
                <Button
                    onClick={() => clearCart()}
                >Clear Cart</Button>
                <Button
                    onClick={() => placeOrder()}
                >Place Order</Button>
            </div>
        </div>
    )
}

export default Cart