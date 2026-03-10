import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	BookOpen,
	Calendar,
	CalendarClock,
	Check,
	Clock,
	FileText,
	MessageSquare,
	User,
	Users,
	X,
} from 'lucide-react';
import {
	formatTime,
	type ConsultationDialogProps,
} from '../../interface/consultation';
import { Badge } from '@/components/ui/badge';
import { differenceInMinutes, format, isAfter, parse } from 'date-fns';
import { apiAdviserUrl } from '@/Routes/http';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	consultationIcon,
	getUserToken,
	statusColor,
} from '@/components/functions/functions';
import RescheduleConsultation from '@/components/Student/ConsultationComponents/RescheduleConsultationv2';
import { cn } from '@/lib/utils';

const ConsultationDetails = ({
	open,
	weeklies,
	availabilities,
	weekly,
	setOpen,
	refresh,
}: ConsultationDialogProps) => {
	const [feedback, setFeedback] = useState<string | null>(
		weekly?.feedback ?? '',
	);
	const nowDateTime = format(new Date(), 'HH:mm');
	const [rescheduleDialog, setRescheduleDialog] = useState(false);
	const userToken = getUserToken();
	if (!weekly) return null;

	const updateStatus = async (
		status: string,
		actual_start: string,
		actual_end: string,
	) => {
		try {
			const payLoad = {
				status: status,
				feedback: weekly?.status === 'completed' ? feedback : weekly?.feedback,
				actual_start:
					weekly?.status === 'upcoming' ? actual_start : weekly?.actual_start,
				actual_end:
					weekly?.status === 'ongoing' ? actual_end : weekly.actual_end,
			};
			const res = await fetch(`${apiAdviserUrl}/${weekly.id}/weekly/update`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
				body: JSON.stringify(payLoad),
			});

			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			} else if (result.status === 500) {
				console.log(result.error);
				return;
			}

			if (result.status === 200) {
				toast.success(result.message);
				setOpen(false);
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const trimSeconds = (time: string) => time.slice(0, 5);
	const startDateTime = parse(`${weekly.date}`, 'yyyy-MM-dd', new Date());

	const startDateTimeMin = parse(
		`${weekly.date} ${trimSeconds(weekly.start_time)}`,
		'yyyy-MM-dd HH:mm',
		new Date(),
	);
	const actualStartDateTime = parse(
		`${weekly.date} ${weekly.actual_start !== null ? trimSeconds(weekly.actual_start) : ''}`,
		'yyyy-MM-dd HH:mm',
		new Date(),
	);

	const endDateTime = parse(
		`${weekly.date} ${trimSeconds(weekly.end_time)}`,
		'yyyy-MM-dd HH:mm',
		new Date(),
	);
	const actualEndDateTime = parse(
		`${weekly.date} ${weekly.actual_end !== null ? trimSeconds(weekly.actual_end) : ''}`,
		'yyyy-MM-dd HH:mm',
		new Date(),
	);
	const isOngoing = isAfter(new Date(), startDateTime);

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[500px] text-white">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between capitalize">
							<span>Consultation Details</span>
							<Badge
								variant="outline"
								className={cn('', statusColor[weekly.status])}
							>
								{consultationIcon[weekly.status]}
								{weekly.status}
							</Badge>
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 py-4">
						<div className="grid w-full min-w-0 grid-cols-1 gap-4">
							{(weekly.actual_start !== null || weekly.actual_end !== null) && (
								<div className="flex gap-2">
									{weekly.start_time !== weekly.actual_start &&
									weekly.actual_start !== null ? (
										<div className="rounded-full border border-amber-500/40 text-amber-500 bg-amber-500/20 py-0.5 px-3 font-medium text-sm">
											{startDateTimeMin > actualStartDateTime
												? `-${differenceInMinutes(startDateTimeMin, actualStartDateTime)}mins early`
												: `+${differenceInMinutes(actualStartDateTime, startDateTimeMin)}mins delayed`}
										</div>
									) : (
										''
									)}
									{weekly.end_time !== weekly.actual_end &&
									weekly.actual_end !== null ? (
										<div className="rounded-full border border-red-500/40 text-red-500 bg-red-500/20 py-0.5 px-3 font-medium text-sm">
											{endDateTime > actualEndDateTime
												? `-${differenceInMinutes(endDateTime, actualEndDateTime)}mins early ended`
												: `+${differenceInMinutes(actualEndDateTime, endDateTime)}mins overrun`}
										</div>
									) : (
										''
									)}
								</div>
							)}

							<div className="flex items-start gap-3">
								<BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Thesis/Capstone:</p>
									<p className="text-sm text-muted-foreground">
										{weekly.student.project.title}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Users className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Members:</p>
									<div className="text-sm text-muted-foreground flex gap-1.5 mt-1">
										<div className="bg-primary/10 border-primary/40 py-1 px-2 border rounded-sm flex gap-2 items-center text-primary">
											<User className="w-4 h-4" />
											<p className="text-xs font-medium">
												{weekly.student.project.group_leader.name}
											</p>
										</div>
										{weekly.student.project.details.map((student) => (
											<div
												key={student.student.id}
												className="bg-primary/10 border-primary/40 py-1 px-2 border rounded-sm flex gap-2 items-center text-primary"
											>
												<User className="w-4 h-4" />
												<p className="text-xs font-medium">
													{student.student.name}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Date</p>
									<p className="text-sm text-muted-foreground">
										{format(weekly.date, 'EEEE, MMMM d, yyyy')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Time</p>
									<p className="text-sm text-muted-foreground">
										{formatTime(weekly.start_time)} -{' '}
										{formatTime(weekly.end_time)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Purpose</p>
									<p className="text-sm text-muted-foreground">
										{weekly.purpose}
									</p>
								</div>
							</div>
							{weekly.actual_start != null && (
								<div className="flex items-start gap-3">
									<CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm font-medium">Consultation Duration</p>
										<p className="text-sm text-muted-foreground">
											Started at {formatTime(weekly.actual_start)}
										</p>
										<p className="text-sm text-muted-foreground">
											{weekly.actual_end != null
												? `Ended at ${formatTime(weekly.actual_end)}`
												: ''}
										</p>
									</div>
								</div>
							)}

							{weekly.status === 'completed' && (
								<div className="flex flex-row items-start gap-3">
									<MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
									<div className="w-full flex flex-col gap-2 min-w-0">
										<p className="text-sm font-medium">Consultation Summary</p>
										{weekly.feedback !== null && (
											<p className="text-sm text-muted-foreground">
												{weekly.feedback}
											</p>
										)}
										{weekly.feedback === null && (
											<Textarea
												id="feedback"
												onChange={(e) => setFeedback(e.target.value)}
												autoComplete="off"
												placeholder="Provide a brief conclusion of the consultation, including recommendations and required actions..."
												className="w-full resize-none"
											/>
										)}
									</div>
								</div>
							)}
						</div>

						{weekly.status === 'cancelled' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										setRescheduleDialog(true);
									}}
									variant="outline"
									className="flex-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-500"
								>
									Reschedule
								</Button>
							</div>
						)}

						{weekly.status === 'upcoming' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="inline-flex">
											<Button
												onClick={() => {
													updateStatus('ongoing', nowDateTime, '');
													setOpen(false);
												}}
												className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 hover:text-emerald-500 text-emerald-500"
												variant="outline"
												disabled={!isOngoing}
											>
												<Check />
												Start Consultation
											</Button>
										</span>
									</TooltipTrigger>
									<TooltipContent>
										{!isOngoing && (
											<p className="font-normal text-sm text-muted-foreground">
												Available {`on ${format(weekly?.date, 'EEEE')}`}
											</p>
										)}
										{isOngoing && (
											<p className="font-normal text-sm text-muted-foreground">
												Start Consultation
											</p>
										)}
									</TooltipContent>
								</Tooltip>

								<Button
									variant="destructive"
									onClick={() => {
										updateStatus('cancelled', '', '');
										setOpen(false);
									}}
									className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-500"
								>
									<X />
									Cancel Consultation
								</Button>
							</div>
						)}
						{weekly.status === 'ongoing' && (
							<div className="grid grid-cols-1 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('completed', '', nowDateTime);
										setOpen(false);
									}}
									className="flex-1 bg-red-500/20 hover:b-red-500/40 text-red-500 hover:bg-red-500/30"
									variant="outline"
								>
									<X />
									End Consultation
								</Button>
							</div>
						)}
						{weekly.status === 'completed' && weekly.feedback === null && (
							<div className="grid grid-cols-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('completed', '', '');
										setOpen(false);
									}}
									className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-500 col-start-1 col-span-2"
									variant="outline"
									disabled={!feedback}
								>
									<Check />
									Leave a feedback
								</Button>
							</div>
						)}
					</div>
					{rescheduleDialog && weekly && (
						<RescheduleConsultation
							open={rescheduleDialog}
							setOpen={setRescheduleDialog}
							availabilities={availabilities}
							weeklies={weeklies}
							selectedSchedule={weekly}
							refresh={refresh}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ConsultationDetails;
