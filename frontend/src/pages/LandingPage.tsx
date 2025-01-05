import React from 'react'


import { Outlet } from "react-router-dom"

import { SidebarProvider } from '../components/ui/sidebar'
import Navbar from '../components/my_created/Navbar'
import { AppSidebar } from '@/components/my_created/AppSideBar'


type Props = {}
function LandingPage({ }: Props) {
    
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full min-h-screen flex flex-col ">
                    <Navbar />
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </div>
    )
}

export default LandingPage