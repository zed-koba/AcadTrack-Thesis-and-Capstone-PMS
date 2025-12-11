import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { LayoutDashboard, LibraryBig, UserRound } from 'lucide-react';

const AdminLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Instructor', icon: <LayoutDashboard /> },
		{ label: 'Proponents', to: '/Instructor/Proponents', icon: <LibraryBig /> },
		{ label: 'Students', to: '/Instructor/Students', icon: <UserRound /> },
	];
	return (
		<div className="flex content-start relative">
			<Sidebar navItem={navItem} />
			<main className="px-4 py-5 bg-background grow relative">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
