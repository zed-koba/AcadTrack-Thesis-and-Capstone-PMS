import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import {
	Building2,
	Glasses,
	GraduationCap,
	LayoutDashboard,
	LibraryBig,
	UserCog,
	Users,
} from 'lucide-react';
import { Toaster } from 'sonner';

const AdminLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Admin', icon: <LayoutDashboard /> },
		{ label: 'Proponents', to: '/Admin/Proponents', icon: <LibraryBig /> },
		{ label: 'Students', to: '/Admin/Students', icon: <Users /> },
		{ label: 'Departments', to: '/Admin/Departments', icon: <Building2 /> },
		{ label: 'Roles', to: '/Admin/Roles', icon: <UserCog /> },
		{ label: 'Programs', to: '/Admin/Programs', icon: <GraduationCap /> },
		{ label: 'Adviser', to: '/Admin/Adviser', icon: <Glasses /> },
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
