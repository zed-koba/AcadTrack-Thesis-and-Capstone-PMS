import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { CalendarClock, FileText, LayoutDashboard } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const StundentLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Student', icon: <LayoutDashboard /> },
		{
			label: 'Consultation',
			to: '/Student/Consultation',
			icon: <CalendarClock />,
		},
		{ label: 'Document', to: '/Student/Document', icon: <FileText /> },
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
