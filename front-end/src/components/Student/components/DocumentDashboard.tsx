import { cn } from '@/lib/utils';
import {
	Calendar,
	CircleCheckBig,
	Clock,
	Eye,
	FileExclamationPoint,
	FileText,
} from 'lucide-react';

const DocumentDashboard = () => {
	const dashboard = [
		{
			color: 'bg-blue-500/20',
			icon: <FileText className="w-5 h-5 text-blue-500" />,
			value: 5,
			label: 'Total Consultation',
		},
		{
			color: 'bg-amber-500/20',
			icon: <Clock className="w-5 h-5 text-amber-500" />,
			value: 2,
			label: 'Pending',
		},
		{
			color: 'bg-success/20',
			icon: <Eye className="w-5 h-5 text-success" />,
			value: 2,
			label: 'Under Review',
		},
		{
			color: 'bg-red-500/20',
			icon: <FileExclamationPoint className="w-5 h-5 text-red-500" />,
			value: 3,
			label: 'Need Revision',
		},
		{
			color: 'bg-green-500/10',
			icon: <CircleCheckBig className="w-5 h-5 text-green-500" />,
			value: 5,
			label: 'Approved',
		},
	];
	return (
		<>
			<div className="flex flex-col gap-5 mt-5 w-full text-white">
				<section className="grid lg:grid-cols-5 sm:grid-cols-2 gap-2 mb-6">
					{dashboard.map((board) => (
						<div className="border bg-card rounded-md p-4 flex gap-3 justify-start items-start">
							<div
								className={cn(
									'flex justify-center items-center p-3 rounded-md',
									board.color
								)}
							>
								{board.icon}
							</div>
							<div className="grid grid-row-2">
								<p className="font-bold text-2xl ">{board.value}</p>
								<p className="text-xs font-regular text-muted-foreground">
									{board.label}
								</p>
							</div>
						</div>
					))}
				</section>
			</div>
		</>
	);
};

export default DocumentDashboard;
