import { CircleCheckBig, CircleX, UserCog, Users2 } from 'lucide-react';
import type { ProgramsDashboardProps } from '../interface/programs';

const ProgramsDashboard = ({ programs = [] }: ProgramsDashboardProps) => {
	const activeCount = programs.filter((r) => r.status === 'active').length;
	const inactiveCount = programs.filter((r) => r.status === 'inactive').length;
	const mostStudents =
		programs.length === 0
			? undefined
			: programs.reduce(
					(prev, curr) =>
						curr.students_count > prev.students_count ? curr : prev,
					programs[0]
			  );
	const dashboards = [
		{
			label: 'Total Programs',
			value: programs.length,
			icon: <UserCog size={16} />,
		},
		{
			label: 'Active ',
			value: activeCount,
			icon: <CircleCheckBig size={16} />,
		},
		{ label: 'Inactive ', value: inactiveCount, icon: <CircleX size={16} /> },
		{
			label: 'Most Students Enrolled',
			value: mostStudents?.code,
			icon: <Users2 size={16} />,
		},
	];
	return (
		<>
			<div className="grid grid-row-2 gap-4 mt-5">
				<div className="grid md:grid-cols-4 gap-2">
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
								{programs.length === 0 ? 'No Program' : dashboard.value}
								{index === dashboards.length - 1 && (
									<div className="text-muted-foreground font-normal text-sm">
										{programs.length === 0 ? '' : mostStudents?.students_count}{' '}
										Students
									</div>
								)}
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default ProgramsDashboard;
