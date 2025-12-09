import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import type { NavItem } from '../interface/type';
import { Calendar, LayoutDashboard } from 'lucide-react';

const AdviserLayout = () => {
	const navItem: NavItem[] = [
		{ label: 'Dashboard', to: '/Adviser', icon: <LayoutDashboard /> },
		{ label: 'Consultation', to: '/Adviser/Consultation', icon: <Calendar /> },
	];
	return (
		<div className="flex flex-wrap content-start relative">
			<Sidebar navItem={navItem} />
			<main className="px-4 py-3 bg-background grow relative">
				<Outlet />
			</main>
		</div>
	);
};

export default AdviserLayout;
