import React, { useState } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Switch } from "@/components/ui/switch"
type Props = {}
function Navbar({ }: Props) {
  const [theme, setTheme] = useState('');
  function toggleTheme(checked: boolean) {
    if (checked) {
      document.documentElement.classList.add('dark'); 
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark'); 
      setTheme('');
    }
  }
  console.log("rerendered");
  
  return (
    <div className='h-15 text-primary  bg-secondary flex items-center gap-4 p-5'>
      <SidebarTrigger className='bg-secondary' />
      <Switch
        onCheckedChange={toggleTheme}
      />
    </div>
  );
}
export default Navbar;
