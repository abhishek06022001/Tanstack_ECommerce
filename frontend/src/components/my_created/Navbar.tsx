import React, { useContext, useState } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Switch } from "@/components/ui/switch"
import { ShoppingCart } from "lucide-react"
import ShoppingCartButton from './ShoppingCartButton'
import { CartContext } from '@/main'
type Props = {}
function Navbar({ }: Props) {
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  function toggleTheme(checked: boolean) {
    if (checked) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('');
      localStorage.setItem('theme', 'light');
    }
  }  
  const { cart } = useContext(CartContext);

  return (
    <div className='h-15 text-primary   bg-secondary flex justify-between gap-4 p-5 ' >
      <div >
        <SidebarTrigger className='bg-secondary mr-5' />
        <Switch
          defaultChecked={(theme === 'dark') ? true : false}
          onCheckedChange={toggleTheme}
        />
      </div>
      <div>
        <ShoppingCartButton/>
      </div>
    </div>
  );
}
export default Navbar;
