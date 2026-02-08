import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	CalendarClock,
	CalendarPlus,
	CheckCircle,
	RefreshCcw,
	User,
	X,
} from 'lucide-react';
import type { ConsultationContentProps } from '../interface/consultation';
import {
	consultationIcon,
	getDateLabel,
	getTime,
	pastSessions,
	statusColor,
	upcomingSessions,
} from '@/components/functions/functions';
import {
	type AdviserWeeklyProps,
	to12HourTime,
} from '@/components/Adviser/interface/consultation';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationCard from './ConsultationCard';
import { useState } from 'react';
import BookConsultationDialog from './BookConsultationDialogv2';
import RescheduleConsultation from './RescheduleConsultationv2';
import CancelAlertDialog from './CancelAlertDialog';
import { differenceInMinutes } from 'date-fns';

const ConsultationContent = ({
	weeklies,
	project,
	availabilities,
	refresh,
}: ConsultationContentProps) => {
	const studentIds = (project?.details.map((d) => d.student_id) ?? []).filter(
		(id) => id !== undefined,
	);
	const [bookingDialog, setBookingDialog] = useState(false);
	const [rescheduleDialog, setRescheduleDialog] = useState(false);
	const [cancelDialog, setCancelDialog] = useState(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<AdviserWeeklyProps>();
	const filterSchedule = upcomingSessions(weeklies)
		.filter((w) => studentIds?.includes(w.student_id))
		.sort((a, b) => {
			const aStart = new Date(`${a.date}T${a.start_time}`).getTime();
			const bStart = new Date(`${b.date}T${b.start_time}`).getTime();
			return aStart - bStart;
		});
	const filterPastSessions = pastSessions(weeklies).filter((past) =>
		studentIds?.includes(past.student_id),
	);
	const statusBg: Record<string, string> = {
		upcoming: 'bg-emerald-500/5 border-emerald-500/50',
		ongoing: 'bg-sky-500/5 border-sky-500/50',
	};
	const statusText: Record<string, string> = {
		upcoming: 'text-emerald-500',
		ongoing: 'text-sky-500',
	};

	return (
		<>
			<div className="lg:col-span-2 mt-5">
				{/* Featured Next Consultation */}
				{filterSchedule.length > 0 && (
					<Card
						className={cn('text-white', statusBg[filterSchedule[0].status])}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle
									className={cn(
										'text-sm font-medium',
										statusText[filterSchedule[0].status],
									)}
								>
									Next Consultation
								</CardTitle>
								<Badge
									variant="outline"
									className={cn(
										'capitalize',
										statusColor[filterSchedule[0].status],
									)}
								>
									{consultationIcon[filterSchedule[0].status]}{' '}
									{filterSchedule[0].status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4">
								<div className="text-center py-3 px-5 rounded-lg bg-primary/10">
									<p className="text-3xl font-bold font-mono text-primary">
										{to12HourTime(filterSchedule[0].start_time)}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										{getDateLabel(filterSchedule[0].date)} •{' '}
										{differenceInMinutes(
											getTime(
												filterSchedule[0].date,
												filterSchedule[0].end_time,
											),
											getTime(
												filterSchedule[0].date,
												filterSchedule[0].start_time,
											),
										)}{' '}
										min
									</p>
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-lg">
										{filterSchedule[0].purpose}
									</h3>
									<p className="text-muted-foreground flex items-center gap-1 mt-1">
										<User className="h-4 w-4" />
										{project?.adviser.name}
									</p>
									<div className="flex gap-2 mt-3">
										<Button
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-white bg-red-500/20 border-red-500/40 border hover:bg-red-500 w-35"
											onClick={() => {
												setSelectedSchedule(filterSchedule[0]);
												setCancelDialog(true);
											}}
										>
											<X />
											Cancel
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
				<Tabs defaultValue="upcoming" className="space-y-4 mt-5">
					<div className="flex justify-between shrink">
						<TabsList className="bg-muted">
							<TabsTrigger value="upcoming" className="gap-2">
								<CalendarClock className="h-4 w-4" />
								Upcoming ({filterSchedule.length})
							</TabsTrigger>
							<TabsTrigger value="history" className="gap-2">
								<CheckCircle className="h-4 w-4" />
								History ({filterPastSessions.length})
							</TabsTrigger>
						</TabsList>
						<Button onClick={() => setBookingDialog(true)}>
							<CalendarPlus className="h-4 w-4 mr-2" />
							Book Consultation
						</Button>
					</div>
					<TabsContent value="upcoming" className="space-y-3">
						{filterSchedule.length === 0 ? (
							<Card className="border-border">
								<CardContent className="py-12 text-center">
									<CalendarClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
									<p className="text-muted-foreground mb-4">
										No upcoming consultations
									</p>
									<Button onClick={() => setBookingDialog(true)}>
										Book Your First Consultation
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="grid xl:grid-cols-2 lg:max-xl:grid-cols-1 gap-2">
								{filterSchedule
									.slice(filterSchedule ? 1 : 0)
									.map((consultation) => (
										<ConsultationCard
											key={consultation.id}
											weekly={consultation}
											project={project}
										/>
									))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="history" className="space-y-3">
						{filterPastSessions.length === 0 ? (
							<Card className="border-border">
								<CardContent className="py-12 text-center">
									<CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
									<p className="text-muted-foreground">
										No consultation history yet
									</p>
								</CardContent>
							</Card>
						) : (
							filterPastSessions.map((consultation) => (
								<ConsultationCard
									key={consultation.id}
									weekly={consultation}
									project={project}
								/>
							))
						)}
					</TabsContent>
				</Tabs>
			</div>
			{bookingDialog && (
				<BookConsultationDialog
					open={bookingDialog}
					setOpen={setBookingDialog}
					availabilities={availabilities}
					project={project}
					studentIds={studentIds}
					weeklies={weeklies}
					refresh={refresh}
				/>
			)}
			{rescheduleDialog && selectedSchedule && (
				<RescheduleConsultation
					open={rescheduleDialog}
					setOpen={setRescheduleDialog}
					availabilities={availabilities}
					weeklies={weeklies}
					selectedSchedule={selectedSchedule}
					refresh={refresh}
				/>
			)}

			{cancelDialog && selectedSchedule && (
				<CancelAlertDialog
					open={cancelDialog}
					setOpen={setCancelDialog}
					project={project}
					selectedSchedule={selectedSchedule}
					refresh={refresh}
				/>
			)}
		</>
	);
};

export default ConsultationContent;
