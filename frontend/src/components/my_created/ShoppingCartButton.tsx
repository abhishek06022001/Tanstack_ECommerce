import { CartContext } from '@/main';
import { ShoppingCart } from 'lucide-react'
import React, { useContext } from 'react'
import { Button } from 'react-day-picker'

type Props = {}

function ShoppingCartButton({}: Props) {
     const { cart } = useContext(CartContext);
  return (
      <button 
      className='relative'
      ><ShoppingCart className='mr-5' size={40} />
      <div className='absolute bottom-5 text-sm left-5  bg-secondary-foreground text-secondary px-1  rounded-3xl '>{cart.length}</div>
    </button>
  )
}

export default ShoppingCartButton