import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { CalendarClock, FileText, LayoutDashboard } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const StundentLayout = () => {
	const navItem: NavItem[] = [
		{
			label: 'Dashboard',
			to: '/Student',
			icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Consultation',
			to: '/Student/Consultation',
			icon: <CalendarClock className="w-5 h-5" strokeWidth={2.5} />,
		},
		{
			label: 'Document',
			to: '/Student/Document',
			icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
		},
	];
	return (
		<div className="flex gap-5 content-start h-full relative">
			<Sidebar navItem={navItem} />
			<main className="px-4 py-5 bg-background grow relative">
				<Outlet />
				<Toaster position="top-center" />
			</main>
		</div>
	);
};

export default StundentLayout;
