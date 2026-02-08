import { CircleCheckBig, CircleX, UserCog } from 'lucide-react';
import type { AdviserDashboardProps } from '../interface/adviser';

const AdvisersDashboard = ({ advisers = [] }: AdviserDashboardProps) => {
	const activeCount = advisers.filter((r) => r.status === 'active').length;
	const inactiveCount = advisers.filter((r) => r.status === 'inactive').length;

	const dashboards = [
		{
			label: 'Total Programs',
			value: advisers.length,
			icon: <UserCog size={16} />,
		},
		{
			label: 'Active ',
			value: activeCount,
			icon: <CircleCheckBig size={16} />,
		},
		{ label: 'Inactive ', value: inactiveCount, icon: <CircleX size={16} /> },
	];
	return (
		<>
			<div className="grid grid-row-2 gap-4 mt-5">
				<div className="grid md:grid-cols-3 gap-2">
					{dashboards.map((dashboard, index) => (
						<div className="border rounded-lg p-6 flex flex-col justify-start items-start bg-card text-white shadow-sm gap-5">
							<div className="flex justify-between w-full space-y-0">
								<span className="font-medium text-sm text-white">
									{dashboard.label}
								</span>
								<span className="font-medium text-muted-foreground">
									{dashboard.icon}
								</span>
							</div>

							<span
								className={`grid ${
									index === dashboards.length - 1
										? 'font-medium text-lg'
										: 'font-semibold text-3xl'
								} text-white`}
							>
								{dashboard.value}
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default AdvisersDashboard;
