import {
	BookOpen,
	Calendar,
	CalendarClock,
	CheckCircle,
	Clock,
	User,
} from 'lucide-react';
import type { ConsultationDashboard } from '../interface/consultation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { dayToNumber, getDayNumber } from '@/components/functions/functions';
import { Badge } from '@/components/ui/badge';
import { to12HourTime } from '@/components/Adviser/interface/consultation';

const ConsultationDashboard = ({
	weeklies,
	project,
	availabilities,
}: ConsultationDashboard) => {
	const filterPending = weeklies.filter((w) => w.status === 'pending');
	const filterCompleted = weeklies.filter((w) => w.status === 'completed');
	const now = new Date();

	const upcomingSessions = weeklies.filter((s) => {
		if (s.status !== 'approved') return false;

		const endDateTime = new Date(`${s.date}T${s.end_time}`);

		return endDateTime > now;
	});

	const dashboards = [
		{
			label: 'Pending Approval',
			value: filterPending.length,
			iconBg: 'bg-amber-500/10',
			icon: <Clock className="h-6 w-6 text-amber-500" />,
		},
		{
			label: 'Upcoming Sessions',
			value: upcomingSessions.length,
			iconBg: 'bg-emerald-500/10',
			icon: <Calendar className="h-6 w-6 text-emerald-500" />,
		},
		{
			label: 'Completed Session',
			value: filterCompleted.length,
			iconBg: 'bg-blue-500/10',
			icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
		},
	];
	return (
		<>
			<div className="flex lg:max-xl:grid lg:max-xl:grid-rows-[6rem_1fr] xl:flex-col gap-4 mt-5 w-auto">
				<div className="space-y-4 lg:max-xl:row-start-2">
					<Card className="border-border">
						<CardHeader className="pb-0">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Your Project
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
									<span className="text-muted-foreground">
										Session Duration
									</span>
									<span className="font-medium">
										{project?.adviser.duration} minutes
									</span>
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
				<div className="grid lg:max-xl:grid-cols-3 gap-3 lg:max-xl:row-start-1 lg:max-xl:col-span-2">
					{dashboards.map((dashboard) => (
						<Card className="border-border py-1">
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
											'w-10 font-medium',
											daySlots.length > 0
												? 'text-white'
												: 'text-muted-foreground',
										)}
									>
										{day}
									</span>
									<div className="flex-1">
										{daySlots.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{daySlots.map((slot, i) => (
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
