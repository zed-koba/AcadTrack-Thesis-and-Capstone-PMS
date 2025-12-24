import { Building2, CircleCheckBig, CircleX } from 'lucide-react';

const DepartmentsDashboard = () => {
	const dashboards = [
		{
			label: 'Total Departments',
			value: 15,
			icon: <Building2 />,
		},
		{ label: 'Active ', value: 2, icon: <CircleCheckBig /> },
		{ label: 'Inactive ', value: 1, icon: <CircleX /> },
	];
	return (
		<>
			<div className="grid grid-row-2 gap-4 mt-5">
				<div className="grid md:grid-cols-3 gap-2">
					{dashboards.map((dashboard) => (
						<div className="border rounded-lg p-6 flex flex-col justify-start items-start bg-card text-white shadow-sm gap-5">
							<div className="flex justify-between w-full space-y-0">
								<span className="font-medium text-sm text-white">
									{dashboard.label}
								</span>
								<span className="font-medium text-md text-muted-foreground">
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

export default DepartmentsDashboard;
