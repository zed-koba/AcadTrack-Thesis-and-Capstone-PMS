import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { Calendar, FileText, LayoutDashboard } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const AdviserLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Adviser', icon: <LayoutDashboard /> },
		{ label: 'Consultation', to: '/Adviser/Consultation', icon: <Calendar /> },
		{ label: 'Documents', to: '/Adviser/Documents', icon: <FileText /> },
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

export default AdviserLayout;
