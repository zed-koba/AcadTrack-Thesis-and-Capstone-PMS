import { NavLink } from 'react-router-dom';
import type { NavItem } from '../interface/type';

type NavItemProps = {
	navItem: NavItem[];
};
const Sidebar = ({ navItem }: NavItemProps) => {
	return (
		<>
			<aside
				className="z-40 w-64 h-screen shrink-0 border-r"
				aria-label="Sidebar"
			>
				<div className="h-full px-3 py-4 h-full bg-[#161B22]">
					<ul className="space-y-2 font-medium pt-1">
						<li>
							<a
								href="#"
								className="items-center text-white text-2xl justify-center flex uppercase"
							>
								Acadtrack
							</a>
						</li>
						{navItem.map((item) => (
							<li>
								<NavLink
									key={item.to}
									to={item.to}
									end
									className={({ isActive }) =>
										[
											'items-center flex px-2 py-1.5 text-lg rounded-xl',
											isActive
												? 'bg-amber-500 group text-white'
												: 'hover:bg-gray-600 bg-[#161B22] text-muted-foreground',
										].join(' ')
									}
								>
									{item.icon}
									<span className="ms-3">{item.label}</span>
								</NavLink>
							</li>
						))}
					</ul>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
