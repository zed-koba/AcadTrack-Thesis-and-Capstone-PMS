import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CalendarCheck,
	CalendarClock,
	CalendarX,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Users,
} from 'lucide-react';
import {
	format,
	startOfWeek,
	addDays,
	isSameDay,
	parseISO,
	parse,
	isAfter,
} from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	type AdviserWeeklyProps,
	type WeeklyConsultationProps,
} from '../../interface/consultation';
import ConsultationDetails from './ConsultationDetails';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { apiAdviserUrl } from '@/components/Routes/http';

const START_HOUR = 7;
const END_HOUR = 19;

// Generate time slots based on meeting duration
const generateTimeSlots = (meetingDuration: number) => {
	const slots: { hour: number; minute: number; time: string }[] = [];
	for (let hour = START_HOUR; hour < END_HOUR; hour++) {
		for (let minute = 0; minute < 60; minute += meetingDuration) {
			const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
			slots.push({ hour, minute, time });
		}
	}
	return slots;
};

const formatTime = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const formatSlotTime = (hour: number, minute: number) => {
	const period = hour >= 12 ? 'PM' : 'AM';
	const displayHours = hour % 12 || 12;
	return `${displayHours}:${minute.toString().padStart(2, '0')} ${period}`;
};
// Check if consultation falls in this time slot
const getConsultationsForSlot = (
	consultations: AdviserWeeklyProps[],
	slotTime: string,
	meetingDuration: number,
) => {
	const [slotHour, slotMinute] = slotTime.split(':').map(Number);
	const slotStartMinutes = slotHour * 60 + slotMinute;
	const slotEndMinutes = slotStartMinutes + meetingDuration;

	return consultations.filter((c) => {
		const [startHour, startMinute] = c.start_time.split(':').map(Number);
		const consultationStartMinutes = startHour * 60 + startMinute;
		return (
			consultationStartMinutes >= slotStartMinutes &&
			consultationStartMinutes < slotEndMinutes
		);
	});
};

const WeeklyConsultation = ({ weeklies, refresh }: WeeklyConsultationProps) => {
	const [open, setOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<AdviserWeeklyProps | null>(null);
	const [currentDate, setCurrentDate] = useState(new Date());
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));
	const navigateWeek = (direction: 'prev' | 'next') => {
		setCurrentDate((prev) => addDays(prev, direction === 'next' ? 7 : -7));
	};
	const nowDate = new Date();

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-sky-500/30';
			case 'pending':
				return 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30';
			case 'completed':
				return 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30';
			case 'rejected':
				return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
			case 'expired':
				return 'bg-slate-500/20 border-slate-500/50 text-slate-200 hover:bg-slate-500/30';
			case 'ongoing':
				return 'bg-sky-500/20 border-sky-500/50 text-sky-500 hover:bg-sky-500/30';
			default:
				return 'bg-muted';
		}
	};
	const getConsultationsForDay = (day: Date) => {
		return weeklies.filter((c) => isSameDay(parseISO(c.date), day));
	};

	const overrunsSchedules = weeklies.filter((w) => w.overrunMinutes > 0).length;
	const timeSlots = useMemo(
		() => generateTimeSlots(weeklies[0].adviser.duration),
		[weeklies],
	);

	const updateStatus = async (id: number, status: string, feedback: string) => {
		const payLoad = {
			status: status,
			feedback: feedback,
		};
		try {
			const res = await fetch(`${apiAdviserUrl}/${id}/weekly/update`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payLoad),
			});
			const result = await res.json();
			if (result.status === 500) {
				console.log(result.error);
				console.log(result.message);

				return;
			}
			if (result.status === 200) {
				console.log(result.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const expiredPostedRef = useRef<Set<string>>(new Set());
	useEffect(() => {
		weeklies.forEach((w) => {
			const endDateTime = parse(
				`${w.date} ${w.end_time}`,
				'yyyy-MM-dd HH:mm:ss',
				new Date(),
			);

			if (
				isAfter(nowDate, endDateTime) &&
				w.status === 'pending' &&
				!expiredPostedRef.current.has(String(w.id))
			) {
				expiredPostedRef.current.add(String(w.id));
				updateStatus(w.id, 'expired', '');
			}
		});
	}, [weeklies, nowDate]);
	const weekConsultations = useMemo(
		() =>
			weeklies.filter((c) => weekDays.some((day) => isSameDay(c.date, day))),
		[weeklies, weekDays],
	);
	const weekStats = useMemo(
		() => ({
			total: weekConsultations.length,
			pending: weekConsultations.filter((c) => c.status === 'pending').length,
			overruns: weekConsultations.filter((c) => (c.overrunMinutes ?? 0) > 0)
				.length,
			approved: weekConsultations.filter((c) => c.status === 'approved').length,
			ongoing: weekConsultations.filter((c) => c.status === 'ongoing').length,
			completed: weekConsultations.filter((c) => c.status === 'completed')
				.length,
			expired: weekConsultations.filter((c) => c.status === 'expired').length,
		}),
		[weekConsultations],
	);
	return (
		<>
			<Card className="bg-card border-border">
				<CardHeader className="pb-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex items-center gap-3">
							<CardTitle className="text-xl font-semibold">
								Weekly Schedule
							</CardTitle>
							<span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
								{weeklies[0].adviser.duration} min slots
							</span>
						</div>
						<div className="flex items-center gap-2">
							{/* Take a Break Button */}
							{/* {onTakeBreak && (
								<Button
									variant="outline"
									size="sm"
									onClick={onTakeBreak}
									className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
								>
									<Coffee className="h-4 w-4 mr-2" />
									Take a Break
								</Button>
							)} */}
							<Button
								variant="outline"
								size="icon"
								onClick={() => navigateWeek('prev')}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm font-medium min-w-[200px] text-center">
								{format(weekStart, 'MMM d')} -{' '}
								{format(addDays(weekStart, 6), 'MMM d, yyyy')}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() => navigateWeek('next')}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setCurrentDate(new Date())}
							>
								This Week
							</Button>
						</div>
					</div>

					{/* Week Summary */}
					<div className="flex flex-wrap gap-4 mt-4 p-3 rounded-lg bg-muted/30 border border-border">
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								<span className="font-bold">{weekStats.total}</span>{' '}
								consultations
							</span>
						</div>
						{/* {weekStats.breaks > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
								<Coffee className="h-3.5 w-3.5 text-cyan-400" />
								<span className="text-xs text-cyan-400">
									<span className="font-bold">{weekStats.breaks}</span> breaks
								</span>
							</div>
						)} */}
						{overrunsSchedules > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
								<AlertTriangle className="h-3.5 w-3.5 text-red-400" />
								<span className="text-xs text-red-400">
									<span className="font-bold">{overrunsSchedules}</span>{' '}
									overruns
								</span>
							</div>
						)}
						{weekStats.pending > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40">
								<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
								<span className="text-xs text-amber-500">
									<span className="font-bold">{weekStats.pending}</span> pending
								</span>
							</div>
						)}
						{weekStats.approved > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">
								<Check className="h-3.5 w-3.5 text-emerald-500" />
								<span className="text-xs text-emerald-500">
									<span className="font-bold">{weekStats.approved}</span>{' '}
									approved
								</span>
							</div>
						)}
						{weekStats.ongoing > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-sky-500/20 border border-sky-500/40">
								<CalendarClock className="h-3.5 w-3.5 text-sky-500" />
								<span className="text-xs text-sky-500">
									<span className="font-bold">{weekStats.ongoing}</span> ongoing
								</span>
							</div>
						)}
						{weekStats.completed > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/40">
								<CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
								<span className="text-xs text-blue-500">
									<span className="font-bold">{weekStats.completed}</span>{' '}
									completed
								</span>
							</div>
						)}
						{weekStats.expired > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-500/20 border border-slate-400/40">
								<CalendarX className="h-3.5 w-3.5 text-slate-200" />
								<span className="text-xs text-slate-200">
									<span className="font-bold">{weekStats.expired}</span> expired
								</span>
							</div>
						)}
						{/* {weekStats.affected > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
								<AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
								<span className="text-xs text-amber-400">
									<span className="font-bold">{weekStats.affected}</span>{' '}
									delayed by overrun
								</span>
							</div>
						)}
						{weekStats.affectedByBreak > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
								<Pause className="h-3.5 w-3.5 text-cyan-400" />
								<span className="text-xs text-cyan-400">
									<span className="font-bold">{weekStats.affectedByBreak}</span>{' '}
									delayed by break
								</span>
							</div>
						)} */}
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<div className="min-w-[1000px]">
							{/* Table-based layout */}
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-muted/30">
										<th className="w-24 px-2 py-3 text-left text-xs font-medium text-muted-foreground border-b border-r border-border sticky left-0 bg-muted/30 z-10">
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												Time
											</div>
										</th>
										{weekDays.map((day) => {
											const dayConsultations = getConsultationsForDay(day);
											//const dayBreaks = getBreaksForDay(day);
											const hasIssues = dayConsultations.some(
												(c) =>
													// c.isAffectedByOverrun ||
													// c.isAffectedByBreak ||
													(c.overrunMinutes ?? 0) > 0,
											);

											return (
												<th
													key={day.toISOString()}
													className={cn(
														'px-2 py-2 text-center border-b border-l border-border min-w-[120px]',
														isSameDay(day, new Date()) && 'bg-primary/10',
													)}
												>
													<div className="text-xs text-muted-foreground">
														{format(day, 'EEE')}
													</div>
													<div
														className={cn(
															'text-lg font-semibold',
															isSameDay(day, new Date()) && 'text-primary',
														)}
													>
														{format(day, 'd')}
													</div>
													<div className="flex items-center justify-center gap-1 mt-0.5">
														<span className="text-[10px] text-muted-foreground">
															{dayConsultations.length} sessions
														</span>
														{/* {dayBreaks.length > 0 && (
															<Coffee className="h-3 w-3 text-cyan-400" />
														)} */}
														{hasIssues && (
															<AlertTriangle className="h-3 w-3 text-amber-400" />
														)}
													</div>
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{timeSlots.map((slot) => {
										const isHourStart = slot.minute === 0;

										return (
											<tr
												key={slot.time}
												className={cn(
													'border-b border-border/50',
													isHourStart && 'border-t border-border',
												)}
											>
												<td
													className={cn(
														'px-2 py-1 text-[10px] text-muted-foreground align-top border-r border-border sticky left-0 bg-card z-10',
														isHourStart &&
															'font-medium text-foreground text-xs',
													)}
												>
													{formatSlotTime(slot.hour, slot.minute)}
												</td>
												{weekDays.map((day) => {
													const dayConsultations = getConsultationsForDay(day);
													//const dayBreaks = getBreaksForDay(day);
													const slotConsultations = getConsultationsForSlot(
														dayConsultations,
														slot.time,
														weeklies[0].adviser.duration,
													);
													// const slotBreaks = getBreaksForSlot(
													// 	dayBreaks,
													// 	slot.time,
													// 	meetingDuration,
													// );
													const isEmpty = slotConsultations.length === 0;
													//slotBreaks.length === 0;

													return (
														<td
															key={day.toISOString()}
															className={cn(
																'px-1 py-0.5 border-l border-border align-top',
																isSameDay(day, new Date()) && 'bg-primary/5',
																!isEmpty && 'bg-muted/10',
															)}
														>
															{isEmpty ? (
																<div className="h-6" />
															) : (
																<div className="flex flex-col gap-0.5">
																	<TooltipProvider>
																		{/* {slotBreaks.map((breakSlot) => (
																			<Tooltip key={breakSlot.id}>
																				<TooltipTrigger asChild>
																					<div
																						className={cn(
																							'w-full p-1.5 rounded-sm border-l-2 border-dashed text-left text-[10px]',
																							'bg-cyan-500/20 border-cyan-500 text-cyan-300',
																						)}
																					>
																						<div className="flex items-center gap-1">
																							<Coffee className="h-2.5 w-2.5 shrink-0" />
																							<span className="font-medium truncate">
																								Break
																							</span>
																							<span className="px-1 py-0.5 rounded text-[8px] font-bold bg-cyan-500/30">
																								{breakSlot.duration}m
																							</span>
																						</div>
																					</div>
																				</TooltipTrigger>
																				<TooltipContent
																					side="right"
																					className="max-w-[200px] bg-popover border-border"
																				>
																					<div className="space-y-1">
																						<div className="font-semibold text-sm flex items-center gap-1">
																							<Coffee className="h-4 w-4 text-cyan-400" />
																							Break
																						</div>
																						{breakSlot.reason && (
																							<div className="text-xs text-muted-foreground">
																								{breakSlot.reason}
																							</div>
																						)}
																						<div className="text-xs">
																							{formatTime(
																								breakSlot.scheduledStart,
																							)}{' '}
																							-{' '}
																							{formatTime(
																								breakSlot.scheduledEnd,
																							)}
																						</div>
																						<div className="text-xs text-cyan-400 font-medium">
																							{breakSlot.duration} minute break
																						</div>
																					</div>
																				</TooltipContent>
																			</Tooltip>
																		))} */}

																		{/* Render consultations */}
																		{slotConsultations.map((consultation) => {
																			const hasOverrun =
																				(consultation.overrunMinutes ?? 0) > 0;
																			// const isAffected =
																			// 	consultation.isAffectedByOverrun;
																			// const isAffectedByBreak =
																			// 	consultation.isAffectedByBreak;

																			return (
																				<Tooltip key={consultation.id}>
																					<TooltipTrigger asChild>
																						<button
																							onClick={() => {
																								setSelectedSchedule?.(
																									consultation,
																								);
																								setOpen(true);
																							}}
																							className={cn(
																								'w-full p-1.5 rounded-sm border-l-2 text-left text-[10px] transition-all relative cursor-pointer',
																								'hover:brightness-110 hover:z-20',
																								getStatusColor(
																									consultation.status,
																								),
																							)}
																						>
																							<div className="flex items-start justify-between gap-1">
																								<div className="flex-1 min-w-0">
																									<div className="font-medium truncate flex items-center gap-1">
																										<BookOpen className="h-2.5 w-2.5 shrink-0" />
																										{
																											consultation.student
																												.proponent_detail
																												.proponent.title
																										}
																									</div>
																									<div className="opacity-80 text-[9px]">
																										{formatTime(
																											consultation.start_time,
																										).replace(' ', '')}
																									</div>
																								</div>

																								{/* Compact indicators */}
																								<div className="flex flex-col gap-0.5 shrink-0">
																									{hasOverrun && (
																										<span className="px-1 py-0.5 rounded text-[8px] font-bold bg-red-500/40 text-red-200">
																											+
																											{
																												consultation.overrunMinutes
																											}
																											m
																										</span>
																									)}
																									{/* {isAffected && (
																										<span className="px-1 py-0.5 rounded text-[8px] font-bold bg-amber-500/40 text-amber-200">
																											⚠
																										</span>
																									)}
																									{isAffectedByBreak && (
																										<span className="px-1 py-0.5 rounded text-[8px] font-bold bg-cyan-500/40 text-cyan-200">
																											☕
																										</span>
																									)} */}
																								</div>
																							</div>

																							{/* Resolve button */}
																							{/* {(isAffected ||
																								isAffectedByBreak) &&
																								onResolveConflict && (
																									<button
																										onClick={(e) => {
																											e.stopPropagation();
																											onResolveConflict(
																												consultation,
																												findCausingConsultation(
																													consultation,
																												),
																											);
																										}}
																										className={cn(
																											'absolute -right-0.5 -top-0.5 p-0.5 rounded-full transition-colors shadow-md',
																											isAffectedByBreak
																												? 'bg-cyan-500 text-cyan-950 hover:bg-cyan-400'
																												: 'bg-amber-500 text-amber-950 hover:bg-amber-400',
																										)}
																										title="Resolve conflict"
																									>
																										<Wrench className="h-2.5 w-2.5" />
																									</button>
																								)} */}
																						</button>
																					</TooltipTrigger>
																					<TooltipContent
																						side="right"
																						className="max-w-[200px] bg-popover border-border"
																					>
																						<div className="space-y-1">
																							<div className="font-semibold text-sm">
																								{
																									consultation.student
																										.proponent_detail.proponent
																										.title
																								}
																							</div>
																							<div className="text-xs text-muted-foreground flex flex-col mb-2">
																								<span>Purpose: </span>{' '}
																								{consultation.purpose}
																							</div>
																							<div className="text-xs">
																								{formatTime(
																									consultation.start_time,
																								)}{' '}
																								-{' '}
																								{formatTime(
																									consultation.end_time,
																								)}
																							</div>
																							{hasOverrun && (
																								<div className="text-xs text-red-400 font-medium">
																									⚠️ Overran by{' '}
																									{consultation.overrunMinutes}{' '}
																									minutes
																								</div>
																							)}
																							{/* {isAffected && (
																								<div className="text-xs text-amber-400 font-medium">
																									⚠️ Delayed - Click wrench to
																									resolve
																								</div>
																							)}
																							{isAffectedByBreak && (
																								<div className="text-xs text-cyan-400 font-medium">
																									☕ Delayed{' '}
																									{consultation.delayedMinutes}m
																									by break
																								</div>
																							)} */}
																						</div>
																					</TooltipContent>
																				</Tooltip>
																			);
																		})}
																	</TooltipProvider>
																</div>
															)}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</CardContent>
			</Card>
			{selectedSchedule && (
				<ConsultationDetails
					weekly={selectedSchedule}
					open={open}
					setOpen={setOpen}
					refresh={refresh}
				/>
			)}
		</>
	);
};

export default WeeklyConsultation;
