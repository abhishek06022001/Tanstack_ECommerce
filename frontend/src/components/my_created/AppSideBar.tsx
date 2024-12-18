import { Calendar, Home, Inbox, LogIn, LogOut, PackageSearch, Plus, Search, Settings, UserPen, UsersRound } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import { userInfo } from "os"

// Menu items.
const isLoggedOut = [
    {
        title: "Products",
        url: "/",
        icon: PackageSearch,
    },
    {
        title: "Register",
        url: "signup",
        icon: Plus,
    },
    {
        title: "LogIn",
        url: "login",
        icon: LogIn,
    },

]
const isLoggedInUser = [
    {
        title: "Products",
        url: "/",
        icon: PackageSearch,
    },
    {
        title: "Profile",
        url: "profile",
        icon: UserPen,
    },
    {
        title: "Order History",
        url: "order_history",
        icon: History,
    },

]
const isLoggedInAdmin = [
    {
        title: "Products",
        url: "/",
        icon: PackageSearch,
    },
    {
        title: "Profile",
        url: "profile",
        icon: UserPen,
    },
    {
        title: "Users",
        url: "users",
        icon: UsersRound,
    },

]
const footerItems = [
    {
        title: "Logout",
        icon: LogOut,
        color: 'red'
    },
]
export function AppSidebar() {
    const navigate = useNavigate();
    let user_info = localStorage.getItem('user');
    let role = null;
    let id = null;
    if (user_info) {
        user_info = JSON.parse(user_info);
        role = user_info?.role;
        id = user_info?.id;
    }

    function logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        navigate('/');
    }
    return (
        <Sidebar>
            <SidebarContent className="bg-primary-foreground"  >
                <SidebarGroup>
                    {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {id ?
                                <>
                                    {role ? <>
                                        {isLoggedInAdmin.map((isLoggedInAdmin) => (
                                            <SidebarMenuItem key={isLoggedInAdmin.title}>
                                                <SidebarMenuButton asChild >
                                                    <Link to={isLoggedInAdmin.url}>
                                                        
                                                        <span className="text-primary" >{isLoggedInAdmin.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}

                                    </> :
                                        <>
                                            {isLoggedInUser.map((isLoggedInUser) => (
                                                <SidebarMenuItem key={isLoggedInUser.title}>
                                                    <SidebarMenuButton asChild >
                                                        <Link to={isLoggedInUser.url}>
                                                          
                                                            <span className="text-primary">{isLoggedInUser.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}

                                        </>
                                    }
                                </>
                                :
                                <>
                                    {isLoggedOut.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild 
                                            >
                                                <Link to={item.url}>
                                               
                                                    <span className="text-primary">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}

                                </>}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter  >
                <SidebarGroupContent >
                    <SidebarMenu>
                        {id && footerItems.map((item) => (
                            <SidebarMenuItem key={item.title} className="p-0" >
                                <SidebarMenuButton asChild
                                    onClick={logout}
                                   
                                    >
                                    <a >
                                        <item.icon
                                            color={item?.color}
                                        />
                                        <span className="text-primary">{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>

            </SidebarFooter>
        </Sidebar>
    )
}