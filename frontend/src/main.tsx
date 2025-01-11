import { useState, createContext, StrictMode } from "react";

import { createRoot } from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from './routes.tsx'
import { RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Item_Type, ProductCardtype } from './types.ts'

import axios from "axios";
import { ThemeProvider } from "./ThemeContext.tsx";
const queryClient = new QueryClient();

// Interface of the cartType here
interface CartType {
  cart: Item_Type[],
  addToCart: (input: ProductCardtype) => void,
  removeFromCart: (input: ProductCardtype) => void,
  placeOrder: () => void,
  clearCart: () => void,
}
// Defining the cartContext
export const CartContext = createContext<CartType>(
  {
    cart: [], addToCart: (input) => { }, removeFromCart: (input) => { },
    placeOrder: () => { },
    clearCart: () => { }
  }
);
// This will provide the context 
const CartProvider = ({ children }: any) => {
  let arr: Item_Type[] = [];
  let some_arr_string = localStorage.getItem('cart');
  if (some_arr_string) {
    arr = JSON.parse(some_arr_string);
  }
  const [cart, setCart] = useState<Item_Type[]>(arr);
  function addToCart(product: ProductCardtype) {
    const item = cart.findIndex((prod) => prod.product.id == product.id);
    if (item > -1) {
      const new_cart_arr: Item_Type[] = cart.map((prod) => {
        if (prod.product.id == product.id) {
          return { ...prod, quantity: prod.quantity + 1 }
        } else {
          return prod
        }
      })
      setCart(new_cart_arr);
    } else {
      setCart([...cart, { product:product , quantity: 1 }]);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function removeFromCart(product: ProductCardtype) {
    const item = cart.findIndex((prod) => prod.product.id == product.id);
    if (item > -1) {
      const new_cart_arr: Item_Type[] = cart.map((prod) => {
        if (prod.product.id == product.id && prod.quantity >= 1) {
          return { ...prod, quantity: prod.quantity - 1 }
        } else {
          return prod
        }
      })
      setCart(new_cart_arr);
    } else {
      // setCart([...cart, { product: id, quantity: 1 }]);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  async function placeOrder() {
    // call api here 
    const ac_token = localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');
    const id = userString ? JSON.parse(userString).id : null;

    console.log("the id is", id);
    try {
      // console.log("the cart is", cart);
      const res = await axios.post(`api/submit_order/${id}`, [...cart], {
        headers: {
          token: ac_token
        }
      });
      console.log("The res is", res);
      
    } catch (error) {
      console.log("some error", error);
    }
    
    setCart([]);
  }
  function clearCart(){
    setCart([]);
  }
  return <CartContext.Provider value={{ addToCart, removeFromCart, cart, placeOrder,clearCart }} >{children} </CartContext.Provider>
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </CartProvider>
  
  </StrictMode>,
)
