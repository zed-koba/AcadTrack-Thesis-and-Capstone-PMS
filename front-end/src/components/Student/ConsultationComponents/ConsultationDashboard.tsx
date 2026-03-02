import {
	BookOpen,
	CalendarCheck,
	CalendarX,
	CircleCheckBig,
	X,
} from 'lucide-react';
import type { ConsultationDashboardProps } from '../interface/consultation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getDayNumber, studentIds } from '@/components/functions/functions';
import { Badge } from '@/components/ui/badge';
import { to12HourTime } from '@/components/Adviser/interface/consultation';

const ConsultationDashboard = ({
	weeklies,
	project,
	availabilities,
}: ConsultationDashboardProps) => {
	const filterCancelled = weeklies.filter(
		(w) =>
			(w.status === 'cancelled' || w.status === 'rejected') &&
			studentIds(project).includes(w.student_id),
	);
	const filterCompleted = weeklies.filter(
		(w) =>
			w.status === 'completed' && studentIds(project).includes(w.student_id),
	);
	const filterExpired = weeklies.filter(
		(w) => w.status === 'expired' && studentIds(project).includes(w.student_id),
	);
	const now = new Date();
	const upcomingSessions = weeklies.filter((s) => {
		if (s.status !== 'approved') return false;

		const endDateTime = new Date(`${s.date}T${s.end_time}`);

		return endDateTime > now;
	});

	const dashboards = [
		{
			label: 'Upcoming Sessions',
			value: upcomingSessions.length,
			iconBg: 'bg-emerald-500/10',
			icon: <CircleCheckBig className="h-6 w-6 text-emerald-500" />,
		},
		{
			label: 'Completed Session',
			value: filterCompleted.length,
			iconBg: 'bg-blue-500/10',
			icon: <CalendarCheck className="h-6 w-6 text-blue-500" />,
		},
		{
			label: 'Cancelled Session',
			value: filterCancelled.length,
			iconBg: 'bg-red-500/10',
			icon: <X className="h-6 w-6 text-red-500" />,
		},
		{
			label: 'Expired Session',
			value: filterExpired.length,
			iconBg: 'bg-slate-500/10',
			icon: <CalendarX className="h-6 w-6 text-slate-200" />,
		},
	];
	return (
		<>
			<div className="flex lg:max-xl:grid lg:max-xl:grid-rows-[6rem_1fr] xl:flex-col gap-4 mt-5 w-auto">
				<div className="space-y-4 lg:max-xl:row-start-2">
					<Card className="border-border">
						<CardHeader className="pb-0">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Your Thesis/Capstone
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-3 mb-4">
								<div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
									<BookOpen className="h-6 w-6 text-primary" />
								</div>
								<div>
									<h4 className="font-semibold">{project?.title}</h4>
									<p className="text-sm text-muted-foreground">
										{project?.details[0].student.program.name}
									</p>
								</div>
							</div>
							<div className="space-y-2 text-sm">
								<div className="flex items-center justify-between py-2 border-t border-border">
									<span className="text-muted-foreground">Adviser</span>
									<span className="font-medium">{project?.adviser.name}</span>
								</div>

								<div className="flex items-center justify-between py-2 border-t border-border">
									<span className="text-muted-foreground">Available Days</span>
									<span className="font-medium">
										{[...new Set(availabilities.map((a) => a.day))].length}{' '}
										days/week
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="grid lg:max-xl:grid-cols-4 gap-3 lg:max-xl:row-start-1 lg:max-xl:col-span-2">
					{dashboards.map((dashboard) => (
						<Card className="border-border py-1" key={dashboard.label}>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-2xl font-bold text-amber-500">
											{dashboard.value}
										</p>
										<p className="text-xs text-muted-foreground">
											{dashboard.label}
										</p>
									</div>
									<div
										className={cn(
											'h-12 w-12 rounded-md flex items-center justify-center',
											dashboard.iconBg,
										)}
									>
										{dashboard.icon}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				<Card className="border-border lg:max-xl:row-start-2">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Adviser Availability
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
							const daySlots = availabilities.filter(
								(a) => getDayNumber(a.day) === index + 1,
							);
							return (
								<div key={day} className="flex items-center gap-3 text-sm">
									<span
										className={cn(
											'w-10 font-medium mt-3',
											daySlots.length > 0
												? 'text-white'
												: 'text-muted-foreground',
										)}
									>
										{day}
									</span>
									<div className="flex-1  mt-2">
										{daySlots.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{daySlots
													.sort((a, b) => {
														if (a.start_time !== b.start_time) {
															return a.start_time.localeCompare(b.start_time);
														}
														return a.end_time.localeCompare(b.end_time);
													})
													.map((slot, i) => (
														<Badge
															key={i}
															variant="outline"
															className="text-xs font-normal"
														>
															{to12HourTime(slot.start_time)} -{' '}
															{to12HourTime(slot.end_time)}
														</Badge>
													))}
											</div>
										) : (
											<span className="text-muted-foreground text-xs">
												Not available
											</span>
										)}
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default ConsultationDashboard;
