import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { CalendarClock, FileText, LayoutDashboard } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import UserNav from '../common/UserNav';

const InstructorLayout = () => {
	const navItem: NavItem[] = [
		{
			label: 'Dashboard',
			to: '/Instructor',
			icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Groups',
			to: '/Instructor/Groups',
			icon: <CalendarClock className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Deadlines',
			to: '/Instructor/Deadlines',
			icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
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

export default InstructorLayout;
