import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { Bell, Calendar, FileText, LayoutDashboard } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import UserNav from '../common/UserNav';

const AdviserLayout = () => {
	const navItem: NavItem[] = [
		{
			label: 'Dashboard',
			to: '/Adviser',
			icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Consultation',
			to: '/Adviser/Consultation',
			icon: <Calendar className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Documents',
			to: '/Adviser/Documents',
			icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Notifications',
			to: '/Adviser/Notifications',
			icon: <Bell className="w-5 h-5" strokeWidth={2.5} />,
		},
	];
	return (
		<div className="flex content-start h-full relative">
			<Sidebar navItem={navItem} />
			<main className="w-full">
				<UserNav />
				<div className="px-10 py-5 bg-background grow relative">
					<Outlet />
					<Toaster position="top-center" />
				</div>
			</main>
		</div>
	);
};

export default AdviserLayout;
