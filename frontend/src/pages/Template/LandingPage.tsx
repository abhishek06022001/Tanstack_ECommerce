import Navbar from "@/components/Navbar"
import { AppSidebar } from "@/components/ui/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
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