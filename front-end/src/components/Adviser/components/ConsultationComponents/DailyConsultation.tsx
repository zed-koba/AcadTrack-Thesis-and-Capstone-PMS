import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
	AdviserWeeklyProps,
	WeeklyConsultationProps,
} from '../../interface/consultation';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import {
	AlertTriangle,
	BookOpen,
	CalendarCheck,
	CalendarClock,
	CalendarIcon,
	CalendarX,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Users,
} from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
	consultationIcon,
	getStatusColor,
} from '@/components/functions/functions';
import ConsultationDetails from './ConsultationDetails';
const START_HOUR = 7;
const END_HOUR = 19;
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
const adviserDuration =
	15;
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

const DailyConsultation = ({ weeklies, availabilities, refresh }: WeeklyConsultationProps) => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<AdviserWeeklyProps | null>(null);
	const [open, setOpen] = useState(false);
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
	const navigateDay = (direction: 'prev' | 'next') => {
		setSelectedDate((prev) =>
			direction === 'next' ? addDays(prev, 1) : subDays(prev, 1),
		);
	};
	const dayConsultations = useMemo(
		() =>
			weeklies
				.filter((c) => isSameDay(c.date, selectedDate))
				.sort((a, b) => a.start_time.localeCompare(b.start_time)),
		[weeklies, selectedDate],
	);

	const timeSlots = useMemo(
		() => generateTimeSlots(adviserDuration),
		[weeklies],
	);
	// Calculate stats
	const stats = useMemo(
		() => ({
			total: dayConsultations.length,
			pending: dayConsultations.filter((c) => c.status === 'pending').length,
			completed: dayConsultations.filter((c) => c.status === 'completed')
				.length,
			ongoing: dayConsultations.filter((c) => c.status === 'ongoing').length,
			approved: dayConsultations.filter((c) => c.status === 'approved').length,
			rejected: dayConsultations.filter((c) => c.status === 'rejected').length,
			overruns: dayConsultations.filter((c) => (c.overrunMinutes ?? 0) > 0)
				.length,
			expired: dayConsultations.filter((c) => c.status === 'expired').length,
		}),
		[dayConsultations],
	);
	return (
		<>
			<Card className="bg-card border-border">
				<CardHeader className="pb-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex items-center gap-3">
							<CardTitle className="text-xl font-semibold">
								Daily Schedule
							</CardTitle>
							<span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
								{adviserDuration} min slots
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => navigateDay('prev')}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="min-w-[180px] justify-start text-left font-normal"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{format(selectedDate, 'EEEE, MMM d, yyyy')}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0 bg-popover border-border"
									align="center"
								>
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => {
											if (date) setSelectedDate(date);
											setCalendarOpen(false);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								size="icon"
								onClick={() => navigateDay('next')}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="primary"
								size="sm"
								onClick={() => setSelectedDate(new Date())}
								className={cn(
									isSameDay(selectedDate, new Date()) && 'opacity-50',
								)}
							>
								Today
							</Button>
						</div>
					</div>

					{/* Week Summary */}
					<div className="flex flex-wrap gap-4 mt-4 p-3 rounded-lg bg-muted/30 border border-border">
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								<span className="font-bold">{stats.total}</span> consultations
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
						{stats.overruns > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
								<AlertTriangle className="h-3.5 w-3.5 text-red-400" />
								<span className="text-xs text-red-400">
									<span className="font-bold">{stats.overruns}</span> overruns
								</span>
							</div>
						)}
						{stats.pending > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40">
								<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
								<span className="text-xs text-amber-500">
									<span className="font-bold">{stats.pending}</span> Pending
								</span>
							</div>
						)}
						{stats.approved > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">
								<Check className="h-3.5 w-3.5 text-emerald-500" />
								<span className="text-xs text-emerald-500">
									<span className="font-bold">{stats.approved}</span> approved
								</span>
							</div>
						)}
						{stats.ongoing > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-sky-500/20 border border-sky-500/40">
								<CalendarClock className="h-3.5 w-3.5 text-sky-500" />
								<span className="text-xs text-sky-500">
									<span className="font-bold">{stats.ongoing}</span> ongoing
								</span>
							</div>
						)}
						{stats.completed > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/40">
								<CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
								<span className="text-xs text-blue-500">
									<span className="font-bold">{stats.completed}</span> completed
								</span>
							</div>
						)}
						{stats.expired > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-500/20 border border-slate-400/40">
								<CalendarX className="h-3.5 w-3.5 text-slate-200" />
								<span className="text-xs text-slate-200">
									<span className="font-bold">{stats.expired}</span> expired
								</span>
							</div>
						)}
						{stats.rejected > 0 && (
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 border border-red-500/40">
								<CalendarX className="h-3.5 w-3.5 text-red-500" />
								<span className="text-xs text-red-500">
									<span className="font-bold">{stats.expired}</span> cancelled
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
					<div className="border-t border-border overflow-auto">
						{/* Table-based layout */}
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-muted/30">
									<th className="w-28 px-3 py-2 text-left text-xs font-medium text-muted-foreground border-b border-border">
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											Time Slot
										</div>
									</th>
									<th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground border-b border-border">
										Consultations & Breaks
									</th>
								</tr>
							</thead>
							<tbody>
								{timeSlots.map((slot) => {
									const slotConsultations = getConsultationsForSlot(
										dayConsultations,
										slot.time,
										adviserDuration,
									);

									const isEmpty = slotConsultations.length === 0;
									const isHourStart = slot.minute === 0;

									return (
										<tr
											key={slot.time}
											className={cn(
												'border-b border-border/50 transition-colors',
												isHourStart && 'border-t border-border',
												!isEmpty && 'bg-muted/10',
											)}
										>
											<td
												className={cn(
													'px-3 py-2 text-xs text-muted-foreground align-top border-r border-border',
													isHourStart && 'font-medium text-foreground',
												)}
											>
												<div className="flex items-center gap-1">
													<Clock className="h-3 w-3 shrink-0" />
													{formatSlotTime(slot.hour, slot.minute)}
												</div>
											</td>
											<td className="px-2 py-1.5">
												{isEmpty ? (
													<div className="text-xs text-muted-foreground/50 py-1">
														—
													</div>
												) : (
													<div className="flex flex-col gap-1.5">
														{/* Render consultations */}
														{slotConsultations.map((consultation) => {
															const hasOverrun =
																(consultation.overrunMinutes ?? 0) > 0;
															// const isAffected =
															// 	consultation.isAffectedByOverrun;
															// const isAffectedByBreak =
															// 	consultation.isAffectedByBreak;

															return (
																<div
																	key={consultation.id}
																	className={cn(
																		'flex items-stretch gap-2 p-2 rounded-md border-l-4 transition-all cursor-pointer',
																		'hover:brightness-110 hover:shadow-md',
																		getStatusColor(consultation.status),
																	)}
																	onClick={() => {
																		setSelectedSchedule(consultation);
																		setOpen(true);
																	}}
																>
																	<div className="flex-1 min-w-0">
																		<div className="flex items-center gap-2 flex-wrap">
																			<div className="font-semibold text-sm flex items-center gap-1">
																				<BookOpen className="h-3.5 w-3.5 shrink-0" />
																				{
																					consultation.student.proponent_detail
																						.proponent.title
																				}
																			</div>
																			{/* Status badges */}

																			<span
																				className={cn(
																					'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold capitalize',
																					getStatusColor(consultation.status),
																				)}
																			>
																				{consultationIcon[consultation.status]}
																				{consultation.status}
																			</span>

																			{hasOverrun && (
																				<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/30 text-red-300">
																					<AlertTriangle className="h-2.5 w-2.5" />
																					+{consultation.overrunMinutes}m
																					overrun
																				</span>
																			)}
																			{/* {isAffected && (
																				<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300">
																					<AlertTriangle className="h-2.5 w-2.5" />
																					DELAYED
																				</span>
																			)}
																			{isAffectedByBreak && (
																				<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/30 text-cyan-300">
																					<Coffee className="h-2.5 w-2.5" />+
																					{consultation.delayedMinutes}m by
																					break
																				</span>
																			)} */}
																		</div>
																		<div className="flex items-center gap-3 text-xs opacity-80 mt-1">
																			<span className="flex items-center gap-1">
																				<Clock className="h-3 w-3" />
																				{formatTime(
																					consultation.start_time,
																				)} - {formatTime(consultation.end_time)}
																			</span>
																			<span className="truncate">
																				{consultation.purpose}
																			</span>
																		</div>
																		{/* Show actual time if different */}
																		{consultation.actual_start && (
																			<div className="text-[10px] text-muted-foreground mt-1">
																				Actual:{' '}
																				{formatTime(consultation.actual_start)}
																				{consultation.actual_end &&
																					` - ${formatTime(consultation.actual_end)}`}
																			</div>
																		)}
																	</div>
																</div>
															);
														})}
													</div>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{selectedSchedule && (
							<ConsultationDetails
								weekly={selectedSchedule}
								open={open}
								setOpen={setOpen}
								refresh={refresh}
							/>
						)}
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default DailyConsultation;
