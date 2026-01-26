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
	Users2,
	X,
} from 'lucide-react';
import {
	formatTime,
	to12HourTime,
	type ConsultationDialogProps,
} from '../../interface/consultation';
import { Badge } from '@/components/ui/badge';
import { differenceInMinutes, format, isAfter, isEqual, parse } from 'date-fns';
import { apiAdviserUrl } from '@/components/Routes/http';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { consultationIcon } from '@/components/functions/functions';

const ConsultationDetails = ({
	open,
	weekly,
	setOpen,
	refresh,
}: ConsultationDialogProps) => {
	const [feedback, setFeedback] = useState<string | null>(
		weekly?.feedback ?? '',
	);
	const nowDateTime = format(new Date(), 'hh:mm');
	const nowDate = new Date();
	if (!weekly) return null;

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'approved':
				return (
					<Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
						{consultationIcon[status]}
						Confirmed
					</Badge>
				);
			case 'pending':
				return (
					<Badge className="bg-amber-500/20 border text-amber-400 border-amber-500/50">
						{consultationIcon[status]}
						Pending
					</Badge>
				);
			case 'completed':
				return (
					<Badge className="bg-blue-500/20 border text-blue-400 border-blue-500/50">
						{consultationIcon[status]}
						Completed
					</Badge>
				);
			case 'rejected':
				return <Badge variant="destructive">Cancelled</Badge>;
			case 'expired':
				return (
					<Badge className="bg-slate-500/20 border text-slate-200 border-slate-500/50">
						{consultationIcon[status]}
						Expired
					</Badge>
				);
			case 'ongoing':
				return (
					<Badge className="bg-sky-500/20 text-sky-500 border-sky-500 border">
						{consultationIcon[status]}
						Ongoing
					</Badge>
				);
			default:
				return <Badge>{status}</Badge>;
		}
	};
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
					weekly?.status === 'approved' ? actual_start : weekly?.actual_start,
				actual_end:
					weekly?.status === 'ongoing' ? actual_end : weekly.actual_end,
			};
			const res = await fetch(`${apiAdviserUrl}/${weekly.id}/weekly/update`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
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
				console.log(result.errors);
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
	const startDateTime = parse(
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
	const isPast = isAfter(new Date(), endDateTime);
	const isOngoing = isAfter(new Date(), startDateTime) && !isPast;

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[500px] text-white">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between capitalize">
							<span>Consultation Details</span>
							{getStatusBadge(weekly.status)}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 py-4">
						<div className="grid w-full min-w-0 grid-cols-1 gap-4">
							{(weekly.actual_start !== null || weekly.actual_end !== null) && (
								<div className="flex gap-2">
									{weekly.start_time !== weekly.actual_start &&
									weekly.actual_start !== null ? (
										<div className="rounded-full border border-amber-500/40 text-amber-500 bg-amber-500/20 py-0.5 px-3 font-medium text-sm">
											+{differenceInMinutes(actualStartDateTime, startDateTime)}
											mins delayed
										</div>
									) : (
										''
									)}
									{weekly.end_time !== weekly.actual_end &&
									weekly.actual_end !== null ? (
										<div className="rounded-full border border-red-500/40 text-red-500 bg-red-500/20 py-0.5 px-3 font-medium text-sm">
											+{differenceInMinutes(actualEndDateTime, endDateTime)}
											mins overrun
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
										{weekly.student.proponent_detail.proponent.title}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Users className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Members:</p>
									<div className="text-sm text-muted-foreground flex gap-1.5 mt-1">
										{weekly.student.proponent_detail.proponent.details.map(
											(student) => (
												<div
													key={student.student.id}
													className="bg-muted/50 border-muted/80 py-1 px-2 border rounded-sm flex gap-2 items-center"
												>
													<User className="w-3.5 h-3.5" />
													<p className="text-xs font-normal">
														{student.student.name}
													</p>
												</div>
											),
										)}
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

						{weekly.status === 'pending' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('approved', '', '');
										setOpen(false);
									}}
									variant="ghost"
									className="flex-1 text-blue-500 bg-blue-500/20 hover:bg-blue-500/40"
								>
									<Check />
									Approve
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										updateStatus('rejected', '', '');
										setOpen(false);
									}}
									className="flex-1 text-red-500 bg-red-500/20 hover:bg-red-500/40"
								>
									<X />
									Reject
								</Button>
							</div>
						)}
						{weekly.status === 'rejected' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {}}
									variant="outline"
									className="flex-1 bg-amber-600 hover:bg-amber-600/80"
								>
									Re-schedule
								</Button>
							</div>
						)}

						{weekly.status === 'approved' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="inline-flex">
											<Button
												onClick={() => {
													updateStatus('ongoing', nowDateTime, '');
													setOpen(false);
												}}
												className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-500"
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
												Available{' '}
												{format(nowDate, 'yyyy-MM-dd') === weekly?.date
													? `at ${to12HourTime(weekly?.start_time)}`
													: `on ${format(weekly?.date, 'eee')} at ${to12HourTime(weekly?.start_time)}`}
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
										updateStatus('rejected', '', '');
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
							<div className="grid grid-cols-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('completed', '', nowDateTime);
										setOpen(false);
									}}
									className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-500 col-start-1 col-span-2"
									variant="outline"
									disabled={!isPast}
								>
									<Check />
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
								>
									<Check />
									Leave a feedback
								</Button>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ConsultationDetails;
