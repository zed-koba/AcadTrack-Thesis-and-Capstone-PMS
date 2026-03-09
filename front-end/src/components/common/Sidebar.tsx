import { NavLink, useNavigate } from 'react-router-dom';
import type { NavItem } from '../interface/type';
import { CircleUserRound, LogOut } from 'lucide-react';
import { Separator } from '../ui/separator';
import { getInformation, projectId, user } from '../functions/functions';
import api from '@/lib/api';
import { api as apiUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import type { NotificationProps } from '../Student/interface/notification';

type NavItemProps = {
	navItem: NavItem[];
};
const Sidebar = ({ navItem }: NavItemProps) => {
	const navigate = useNavigate();
	const information = getInformation();
	const handleLogout = async () => {
		try {
			await api.post(`${apiUrl}/logout`);
		} catch (error) {
			console.log(error);
		} finally {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('data');
			localStorage.removeItem('project');
			navigate('/Login');
		}
	};
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);
	const fetchNotifications = async () => {
		try {
			const res = await fetch(
				`${apiUrl}/notifications/${user.role === 'student' ? projectId.proponents_id : information.id}/${user.role}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
				},
			);
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			await setNotifications(result.notifications);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchNotifications();
	}, []);
	const unreadNotification = notifications.filter(
		(notif) => notif.read_at === null,
	);
	return (
		<>
			<aside
				className="relative flex flex-col h-auto shrink-0 bg-background transition-all duration-300 ease-in-out border-r border-muted w-64 min-h-screen"
				aria-label="Sidebar"
			>
				<div className="flex items-center h-16 border-b border-muted transition-all duration-300 px-4">
					<div className="flex items-center gap-2.5 overflow-hidden">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/70">
							<span className="text-sm font-bold text-primary-foreground">
								A
							</span>
						</div>
						<span className="font-bold text-foreground text-base tracking-wide whitespace-nowrap transition-all duration-300 opacity-100">
							ACADTRACK
						</span>
					</div>
				</div>
				<nav className="flex flex-col h-full py-4 px-2 overflow-y-auto justify-between">
					<ul className="space-y-0.5">
						{navItem.map((item) => (
							<li key={item.to}>
								<NavLink
									key={item.to}
									to={item.to}
									end
									className={({ isActive }) =>
										[
											'group relative flex items-center w-full rounded-md transition-all duration-200 px-3 py-2.5 text-sidebar-foreground',
											isActive
												? 'text-sidebar-primary bg-sidebar-primary/10'
												: 'hover:text-foreground text-muted-foreground',
										].join(' ')
									}
								>
									{({ isActive }) => (
										<>
											{isActive && (
												<div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-200 h-5 bg-sidebar-primary" />
											)}
											{item.icon}
											<span className="ml-3 font-medium whitespace-nowrap relative z-10 transition-all duration-300 opacity-100 flex gap-4 items-center">
												{item.label}{' '}
												{item.label === 'Notifications' &&
													unreadNotification.length > 0 && (
														<span className="bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center h-3 w-7 py-2">
															{unreadNotification.length}
														</span>
													)}
											</span>
										</>
									)}
								</NavLink>
							</li>
						))}
					</ul>
					<ul>
						<Separator className="mb-5" />
						<li>
							<div className="group relative flex items-center w-full rounded-md transition-all duration-200 px-3 py-2.5 hover:text-foreground text-muted-foreground cursor-pointer">
								<CircleUserRound className="w-5 h-5" strokeWidth={2.5} />
								<span className="ml-3 font-medium whitespace-nowrap relative z-10 transition-all duration-300 opacity-100">
									{information.name}
								</span>
							</div>
						</li>
						<li>
							<div
								className="group relative flex items-center w-full rounded-md transition-all duration-200 px-3 py-2.5 hover:text-foreground text-muted-foreground cursor-pointer"
								onClick={handleLogout}
							>
								<LogOut className="w-5 h-5" strokeWidth={2.5} />
								<span className="ml-3 font-medium whitespace-nowrap relative z-10 transition-all duration-300 opacity-100">
									Logout{' '}
								</span>
							</div>
						</li>
					</ul>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
