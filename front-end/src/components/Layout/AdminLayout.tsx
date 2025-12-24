import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import {
	Building2,
	Glasses,
	LayoutDashboard,
	LibraryBig,
	UserRound,
} from 'lucide-react';
import { Toaster } from 'sonner';

const AdminLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Admin', icon: <LayoutDashboard /> },
		{ label: 'Proponents', to: '/Admin/Proponents', icon: <LibraryBig /> },
		{ label: 'Students', to: '/Admin/Students', icon: <UserRound /> },
		{ label: 'Adviser', to: '/Admin/Adviser', icon: <Glasses /> },
		{ label: 'Departments', to: '/Admin/Departments', icon: <Building2 /> },
	];
	return (
		<div className="flex content-start relative">
			<Sidebar navItem={navItem} />
			<main className="px-4 py-5 bg-background grow relative">
				<Outlet />
				<Toaster position="top-center" />
			</main>
		</div>
	);
};

export default AdminLayout;
