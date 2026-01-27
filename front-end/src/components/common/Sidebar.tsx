import { NavLink } from 'react-router-dom';
import type { NavItem } from '../interface/type';

type NavItemProps = {
	navItem: NavItem[];
};
const Sidebar = ({ navItem }: NavItemProps) => {
	return (
		<>
			<aside
				className="relative flex flex-col h-auto shrink-0 bg-background transition-all duration-300 ease-in-out border-r border-muted w-56 min-h-screen"
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
				<nav className="flex-1 py-4 px-2 overflow-y-auto">
					<ul className="space-y-0.5">
						{navItem.map((item) => (
							<li>
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
											<span className="ml-3 font-medium whitespace-nowrap relative z-10 transition-all duration-300 opacity-100">
												{item.label}
											</span>
										</>
									)}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
