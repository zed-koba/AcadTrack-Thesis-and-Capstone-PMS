import { CircleCheckBig, CircleX, Globe2, UserCog } from 'lucide-react';
import type { RolesDashboardProps } from '../interface/roles';

const RolesDashboard = ({ roles = [] }: RolesDashboardProps) => {
	const activeCount = roles.filter((r) => r.status === 'active').length;
	const inactiveCount = roles.filter((r) => r.status === 'inactive').length;
	const globalRoles = roles.filter((r) => r.globalRole === 1).length;
	const dashboards = [
		{
			label: 'Total Roles',
			value: roles.length,
			icon: <UserCog size={16} />,
		},
		{
			label: 'Active ',
			value: activeCount,
			icon: <CircleCheckBig size={16} />,
		},
		{ label: 'Inactive ', value: inactiveCount, icon: <CircleX size={16} /> },
		{ label: 'Global Roles', value: globalRoles, icon: <Globe2 size={16} /> },
	];
	return (
		<>
			<div className="grid grid-row-2 gap-4 mt-5">
				<div className="grid md:grid-cols-4 gap-2">
					{dashboards.map((dashboard) => (
						<div className="border rounded-lg p-6 flex flex-col justify-start items-start bg-card text-white shadow-sm gap-5">
							<div className="flex justify-between w-full space-y-0">
								<span className="font-medium text-sm text-white">
									{dashboard.label}
								</span>
								<span className="font-medium text-muted-foreground">
									{dashboard.icon}
								</span>
							</div>
							<span className="font-semibold text-3xl text-white">
								{dashboard.value}
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default RolesDashboard;
