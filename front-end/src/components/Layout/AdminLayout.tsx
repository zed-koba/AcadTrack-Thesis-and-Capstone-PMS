import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import {
	Building2,
	Glasses,
	GraduationCap,
	Landmark,
	LibraryBig,
	UserCog,
	Users,
} from 'lucide-react';
import { Toaster } from 'sonner';

const AdminLayout = () => {
	const navItem: NavItem[] = [
		{
			label: 'Proponents',
			to: '/Admin/Proponents',
			icon: <Users className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Capstone Projects',
			to: '/Admin/Projects',
			icon: <LibraryBig className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Departments',
			to: '/Admin/Departments',
			icon: <Building2 className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Roles',
			to: '/Admin/Roles',
			icon: <UserCog className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Programs',
			to: '/Admin/Programs',
			icon: <GraduationCap className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Adviser',
			to: '/Admin/Adviser',
			icon: <Glasses className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Instructor',
			to: '/Admin/Instructor',
			icon: <Landmark className="w-5 h-5" strokeWidth={2.5} />,
		},
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
