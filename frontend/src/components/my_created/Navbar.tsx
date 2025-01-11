import React, { useContext, useState } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Switch } from "@/components/ui/switch"
import { ShoppingCart } from "lucide-react"
import ShoppingCartButton from './ShoppingCartButton'
import { ThemeContext } from '@/ThemeContext'

type Props = {}
function Navbar({ }: Props) {
  const { theme,toggleTheme} = useContext(ThemeContext);
  console.log("theme is ", theme);
  
  const role= localStorage.getItem('user_role') || null;
  return (
    <div className='h-15 text-primary   bg-secondary flex justify-between gap-4 p-5 ' >
      <div >
        <SidebarTrigger className='bg-secondary mr-5' />
        <Switch
          defaultChecked={(theme === 'dark') ? true : false}
          // defaultChecked={true }
          onCheckedChange={toggleTheme}
        />
      </div>
      <div>
        {(role === "0") ? <ShoppingCartButton /> : null }
        
      </div>
    </div>
  );
}
export default Navbar;
