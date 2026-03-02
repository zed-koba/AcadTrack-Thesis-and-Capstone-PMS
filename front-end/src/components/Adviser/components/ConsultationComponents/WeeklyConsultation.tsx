import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	AlertTriangle,
	BookOpen,
	CalendarCheck,
	CalendarClock,
	CalendarX,
	ChevronLeft,
	ChevronRight,
	CircleCheckBig,
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
import { apiAdviserUrl } from '@/Routes/http';
import {
	generateTimeSlots,
	statusColor,
} from '@/components/functions/functions';

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

const WeeklyConsultation = ({
	weeklies,
	availabilities,
	refresh,
}: WeeklyConsultationProps) => {
	const [open, setOpen] = useState(false);

	const [selectedSchedule, setSelectedSchedule] =
		useState<AdviserWeeklyProps | null>(null);
	const [currentDate, setCurrentDate] = useState(new Date());
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));
	const navigateWeek = (direction: 'prev' | 'next') => {
		setCurrentDate((prev) => addDays(prev, direction === 'next' ? 7 : -7));
	};
	const adviserDuration = 15;

	const getConsultationsForDay = (day: Date) => {
		return weeklies.filter((c) => isSameDay(parseISO(c.date), day));
	};

	const overrunsSchedules = weeklies.filter((w) => w.overrunMinutes > 0).length;
	const timeSlots = useMemo(
		() => generateTimeSlots(adviserDuration),
		[adviserDuration],
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
		const nowDate = new Date();
		weeklies.forEach((w) => {
			const endDateTime = parse(
				`${w.date} ${w.end_time}`,
				'yyyy-MM-dd HH:mm:ss',
				new Date(),
			);

			if (
				isAfter(nowDate, endDateTime) &&
				w.status === 'upcoming' &&
				!expiredPostedRef.current.has(String(w.id))
			) {
				expiredPostedRef.current.add(String(w.id));
				updateStatus(w.id, 'expired', '');
				refresh?.();
			}
		});
	}, [weeklies]);
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
			rejected: weekConsultations.filter((c) => c.status === 'rejected').length,
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
						</div>
						<div className="flex items-center gap-2">
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
								<CircleCheckBig className="h-3.5 w-3.5 text-emerald-500" />
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
						{weekStats.rejected > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 border border-red-500/40">
								<CalendarX className="h-3.5 w-3.5 text-red-500" />
								<span className="text-xs text-red-500">
									<span className="font-bold">{weekStats.expired}</span>{' '}
									cancelled
								</span>
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<div className="min-w-[1000px]">
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
														<span className="text-[12px] text-muted-foreground">
															<span
																className={cn(
																	'text-emerald-500',
																	isSameDay(day, new Date()) && 'text-primary',
																	dayConsultations.length === 0 &&
																		'text-red-400',
																)}
															>
																{dayConsultations.length}{' '}
															</span>
															sessions
														</span>
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
														'px-2 py-1 text-[12px] text-muted-foreground align-center border-r border-border sticky left-0 bg-card z-10',
														isHourStart &&
															'font-medium text-foreground text-xs',
													)}
												>
													{formatSlotTime(slot.hour, slot.minute)}
												</td>
												{weekDays.map((day) => {
													const dayConsultations = getConsultationsForDay(day);

													const slotConsultations = getConsultationsForSlot(
														dayConsultations,
														slot.time,
														adviserDuration,
													);

													const isEmpty = slotConsultations.length === 0;

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
																		{/* Render consultations */}
																		{slotConsultations.map((consultation) => {
																			const hasOverrun =
																				(consultation.overrunMinutes ?? 0) > 0;

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
																								'w-full p-2.5 rounded-sm border-l-3 text-left text-[12px] transition-all relative cursor-pointer',
																								'hover:brightness-150 hover:z-20',
																								statusColor[
																									consultation.status
																								],
																							)}
																						>
																							<div className="flex items-start justify-between gap-1">
																								<div className="flex-1 min-w-0">
																									<div className="font-medium truncate flex items-center gap-1">
																										<BookOpen className="h-4 w-4 shrink-0" />
																										{
																											consultation.student
																												.proponent_detail
																												.proponent.title
																										}
																									</div>
																									<div className="opacity-80 text-[12px]">
																										{formatTime(
																											consultation.start_time,
																										).replace(' ', '')}
																									</div>
																								</div>
																							</div>
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
					weeklies={weeklies}
					availabilities={availabilities}
					open={open}
					setOpen={setOpen}
					refresh={refresh}
				/>
			)}
		</>
	);
};

export default WeeklyConsultation;
