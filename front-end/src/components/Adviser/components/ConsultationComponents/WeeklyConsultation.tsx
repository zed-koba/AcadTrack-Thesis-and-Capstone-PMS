import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { useState } from 'react';
import {
	formatTime,
	type AdviserWeeklyProps,
	type WeeklyConsultationProps,
} from '../../interface/consultation';
import ConsultationDetails from './ConsultationDetails';

// Get position based on time
const getTimePosition = (
	time: string,
	startHour: number = 7,
	endHour: number = 19
) => {
	const [hours, minutes] = time.split(':').map(Number);
	const totalMinutes = (hours - startHour) * 60 + minutes;
	const totalRange = (endHour - startHour) * 60;
	return (totalMinutes / totalRange) * 100;
};

const WeeklyConsultation = ({ weeklies, refresh }: WeeklyConsultationProps) => {
	const [open, setOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<AdviserWeeklyProps | null>(null);
	const [currentDate, setCurrentDate] = useState(new Date());
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	const hours = Array.from({ length: 13 }, (_, i) => i + 7);
	const navigateWeek = (direction: 'prev' | 'next') => {
		setCurrentDate((prev) => addDays(prev, direction === 'next' ? 7 : -7));
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'bg-sky-500/20 border-sky-500/50 text-sky-400 hover:bg-sky-500/30';
			case 'pending':
				return 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30';
			case 'completed':
				return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30';
			case 'rejected':
				return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
			default:
				return 'bg-muted';
		}
	};
	const getConsultationsForDay = (day: Date) => {
		return weeklies.filter((c) => isSameDay(parseISO(c.date), day));
	};
	return (
		<>
			<Card className="bg-card border-border">
				<CardHeader className="flex flex-row items-center justify-between pb-4">
					<CardTitle className="text-xl font-semibold flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Weekly Consultation Schedule
					</CardTitle>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => navigateWeek('prev')}
						>
							<ChevronLeft className="h-4 w-4" size="icon" />
						</Button>
						<span className="text-sm font-medium min-w-[180px] text-center">
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
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="over-x-auto">
						<div className="min-w-[900px]">
							<div className="grid grid-cols-8 border-b border-border">
								<div className="p-3 text-sm font-medium text-muted-foreground">
									Time
								</div>
								{weekDays.map((day) => (
									<div
										key={day.toISOString()}
										className={cn(
											'p-3 text-center border-l border-border',
											isSameDay(day, new Date()) && 'bg-blue-600/10'
										)}
									>
										<div className="text-xs text-muted-foreground">
											{format(day, 'EEE')}
										</div>
										<div
											className={cn(
												'text-lg font-semibold',
												isSameDay(day, new Date()) && 'text-blue-600'
											)}
										>
											{format(day, 'd')}
										</div>
									</div>
								))}
							</div>
							<div className="grid grid-cols-8">
								<div className="border-r border-border">
									{hours.map((hour) => (
										<div
											key={hour}
											className="h-16 border-b border-border p-2 text-base text-muted-foreground flex items-center gap-1"
										>
											<Clock className="h-3 w-3 mt-0.5" />
											{hour % 12 || 12}:00 {hour >= 12 ? 'PM' : 'AM'}
										</div>
									))}
								</div>
								{weekDays.map((day) => {
									const dayConsultations = getConsultationsForDay(day);
									return (
										<div
											key={day.toISOString()}
											className={cn(
												'relative border-l border-border',
												isSameDay(day, new Date()) && 'bg-blue-600/5'
											)}
										>
											{hours.map((hour) => (
												<div
													key={hour}
													className="h-16 border-b border-border/50"
												/>
											))}
											{dayConsultations.map((week) => {
												const top = getTimePosition(week.start_time);

												return (
													<button
														key={week.id}
														style={{
															top: `${top}%`,
														}}
														className={cn(
															'absolute left-1 right-1 cursor-pointer px-3 py-3 rounded-md border text-left text-xs transition-all z-10',
															getStatusColor(week.status)
														)}
														onClick={() => {
															setSelectedSchedule(week);
															setOpen(true);
														}}
													>
														<div className="font-medium truncate text-[11px]">
															{week.student.name}
														</div>
														<div className="text-[9px] opacity-75">
															{formatTime(week.start_time)} -{' '}
															{formatTime(week.end_time)}
														</div>
													</button>
												);
											})}
										</div>
									);
								})}
							</div>
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
