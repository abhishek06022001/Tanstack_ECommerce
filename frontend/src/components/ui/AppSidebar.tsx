import { LogOut, History, UserPen, Plus, UsersRound, PackageSearch, Settings, LogIn } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { logoutUser } from "@/features/userSlice"
import { persistor } from "@/store/store"
import localStorage from "redux-persist/es/storage"

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
    const dispatch = useAppDispatch();
    const { id, role } = useAppSelector(state => state.users_store_reducer);
    function logout() {
        localStorage.removeItem('accessToken');
        dispatch(logoutUser());
        navigate('/');
    }
    return (
        <Sidebar
            className="border-none "
        >
            <SidebarContent className="bg-orange-100 py-10" >
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {id ?
                                <>
                                    {role ? <>
                                        {isLoggedInAdmin.map((isLoggedInAdmin) => (
                                            <SidebarMenuItem key={isLoggedInAdmin.title}>
                                                <SidebarMenuButton asChild className="hover:bg-orange-300 hover:text-orange-800 text-xl active:bg-orange-500
                                                active:text-black
                                                " >
                                                    <Link to={isLoggedInAdmin.url}>
                                                        <isLoggedInAdmin.icon />
                                                        <span>{isLoggedInAdmin.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}

                                    </> :
                                        <>
                                            {isLoggedInUser.map((isLoggedInUser) => (
                                                <SidebarMenuItem key={isLoggedInUser.title}>
                                                    <SidebarMenuButton asChild className="hover:bg-orange-300 hover:text-orange-800 text-xl
                                                     active:bg-orange-500
                                                active:text-black
                                                    " >
                                                        <Link to={isLoggedInUser.url}>
                                                            <isLoggedInUser.icon />
                                                            <span>{isLoggedInUser.title}</span>
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
                                            <SidebarMenuButton asChild className="hover:bg-orange-300 hover:text-orange-800 text-xl
                                             active:bg-orange-500
                                                active:text-black
                                            " >
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}

                                </>}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroupContent>
                    <SidebarMenu>

                        {id && footerItems.map((item) => (
                            <SidebarMenuItem key={item.title} className="p-0" >
                                <SidebarMenuButton asChild
                                    onClick={logout}
                                    className="hover:bg-black hover:text-white" >
                                    <a >
                                        <item.icon
                                            color={item?.color}
                                        />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>

            </SidebarFooter>
        </Sidebar >
    )
}
