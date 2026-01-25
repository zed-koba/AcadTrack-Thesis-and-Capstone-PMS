import { cn } from '@/lib/utils';
import {
	Calendar,
	CalendarCheck,
	CalendarX,
	Check,
	Clock,
	X,
} from 'lucide-react';
import type { ConsultationDashboardProps } from '../../interface/consultation';

const ConsultationDashboard = ({ weeklies }: ConsultationDashboardProps) => {
	const findPending = weeklies.filter((pen) => pen.status === 'pending').length;
	const findApproved = weeklies.filter(
		(pen) => pen.status === 'approved',
	).length;
	const findCancelled = weeklies.filter(
		(pen) => pen.status === 'rejected',
	).length;
	const findCompleted = weeklies.filter(
		(pen) => pen.status === 'completed',
	).length;
	const findExpired = weeklies.filter((pen) => pen.status === 'expired').length;
	const dashboard = [
		{
			color: 'bg-slate-500/20',
			icon: <Calendar className="w-5 h-5 text-slate-200" />,
			value: weeklies.length,
			label: 'Total Consultation',
		},
		{
			color: 'bg-amber-500/20',
			icon: <Clock className="w-5 h-5 text-amber-500" />,
			value: findPending,
			label: 'Pending',
		},
		{
			color: 'bg-emerald-500/20',
			icon: <Check className="w-5 h-5 text-emerald-500" />,
			value: findApproved,
			label: 'Approved',
		},
		{
			color: 'bg-red-500/20',
			icon: <X className="w-5 h-5 text-red-500" />,
			value: findCancelled,
			label: 'Cancelled',
		},
		{
			color: 'bg-blue-500/20',
			icon: <CalendarCheck className="w-5 h-5 text-blue-500" />,
			value: findCompleted,
			label: 'Completed',
		},
		{
			color: 'bg-slate-500/20',
			icon: <CalendarX className="w-5 h-5 text-slate-200" />,
			value: findExpired,
			label: 'Expired',
		},
	];
	return (
		<>
			<div className="flex flex-col gap-5 mt-5 w-full text-white">
				<section className="grid lg:grid-cols-6 sm:grid-cols-2 gap-2 mb-6">
					{dashboard.map((board) => (
						<div
							key={board.label}
							className="border bg-card rounded-md p-4 flex gap-3 justify-start items-start"
						>
							<div
								className={cn(
									'flex justify-center items-center p-3 rounded-md',
									board.color,
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

export default ConsultationDashboard;
