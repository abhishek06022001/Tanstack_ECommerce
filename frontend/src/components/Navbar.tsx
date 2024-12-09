import { SidebarTrigger } from "./ui/sidebar"

type Props = {}
function Navbar({ }: Props) {
    return (
        <div
            className="h-16 bg-black text-white w-full flex items-center justify-between  p-10"
        >
            <SidebarTrigger />
            <div className="flex items-center  text-black gap-4">
                <img src="/assets/search.svg" alt="some svg" className="text-black absolute" />
                {/* <input type="text" placeholder="Search Products" className="p-2 w-60 px-6 placeholder:text-slate-600  " /> */}
               
               
            </div>
        </div>
    )
}

export default Navbar