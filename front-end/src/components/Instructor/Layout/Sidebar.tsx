
import {LayoutDashboard, UsersRound} from 'lucide-react'

const Sidebar = () => {
    return (
        <>     
        <aside className="z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-[#161B22]">
                <ul className="space-y-2 font-medium pt-1">
                    <li>
                        <a href="#" className="items-center text-white text-2xl justify-center flex uppercase">Acadtrack</a>
                    </li>
                    <li>
                        <a href="#" className="items-center flex px-2 py-1.5 text-1xl rounded-xl hover:bg-amber-500 group text-white">
                            <LayoutDashboard/>
                            <span className="ms-3">Dashboard</span>
                        </a>
                    </li>
                    <li>
                         <a href="#" className="items-center flex px-2 py-1.5 text-1xl rounded-xl hover:bg-amber-500 group text-white">
                            <UsersRound/>
                            <span className="ms-3">Students</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
        </>
    )
}

export default Sidebar