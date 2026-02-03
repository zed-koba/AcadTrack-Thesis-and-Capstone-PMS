import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
	ArrowLeft,
	ArrowRight,
	CalendarIcon,
	CheckCircle2,
	Clock,
	Loader2,
	User,
} from 'lucide-react';
import type { BookConsultationprops } from '../interface/consultation';
import { useMemo, useState } from 'react';
import {
	to12HourTime,
	type AdviserAvailabilityProps,
} from '@/components/Adviser/interface/consultation';
import { Calendar } from '@/components/ui/calendar';
import {
	differenceInMinutes,
	format,
	getDay,
	isAfter,
	isSameDay,
	parse,
} from 'date-fns';
import { getDayNumber, studentId } from '@/components/functions/functions';
import { Textarea } from '@/components/ui/textarea';
import { apiStudentUrl } from '@/components/Routes/http';
import { toast } from 'sonner';

type Step = 'date' | 'window' | 'slot' | 'confirm';

const BookConsultationDialog = ({
	open,
	setOpen,
	project,
	availabilities,
	weeklies,
	studentIds,
	refresh,
}: BookConsultationprops) => {
	const [currentStep, setCurrentStep] = useState<Step>('date');
	const [selectedDate, setSelectedDate] = useState<Date>();

	const [purpose, setPurpose] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedWindow, setSelectedWindow] =
		useState<AdviserAvailabilityProps | null>(null);
	const filterWeeklies = weeklies.filter(
		(w) => w.adviser_id == project?.adviser.id,
	);

	const checkExistigSchedule = (checkDate: Date): boolean => {
		//if (!isSameDay(new Date(), checkDate)) return false;
		const checkExistingDate = filterWeeklies.filter(
			(s) =>
				s.status !== 'rejected' &&
				s.status !== 'expired' &&
				s.status !== 'cancelled' &&
				s.date === format(checkDate, 'yyyy-MM-dd') &&
				studentIds.includes(s.student_id),
		);

		return checkExistingDate.length > 0;
	};

	// Check if a slot is booked
	const isSlotBooked = (slot: { start: string; end: string }): boolean => {
		if (!selectedDate) return false;

		return filterWeeklies.some((booking) => {
			if (booking.status === 'cancelled') return false;
			if (!isSameDay(new Date(booking.date), selectedDate)) return false;

			// Check for overlap
			const slotStart = parseInt(slot.start.replace(':', ''));
			const slotEnd = parseInt(slot.end.replace(':', ''));
			const bookingStart = parseInt(booking.start_time.replace(':', ''));
			const bookingEnd = parseInt(booking.end_time.replace(':', ''));

			return slotStart < bookingEnd && slotEnd > bookingStart;
		});
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setCurrentStep('date');
			setSelectedDate(undefined);
			setSelectedWindow(null);

			setPurpose('');
		}
		setOpen(open);
	};
	const steps = [
		{ id: 'date', label: 'Date', icon: CalendarIcon },
		{ id: 'window', label: 'Window', icon: Clock },
		{ id: 'confirm', label: 'Confirm', icon: CheckCircle2 },
	];

	const stepIndex = steps.findIndex((s) => s.id === currentStep);

	//Check if current day has availability
	const dateHasAvailability = (checkDate: Date): boolean => {
		const dayOfWeek = getDay(checkDate);
		return availabilities.some((slot) => getDayNumber(slot.day) === dayOfWeek);
	};
	const getSlotsForDay = (checkDate: Date) => {
		const dayOfWeek = getDay(checkDate);
		return availabilities.filter(
			(slot) => getDayNumber(slot.day) === dayOfWeek,
		);
	};
	const dateHasFutureAvailability = (checkDate: Date): boolean => {
		const slots = getSlotsForDay(checkDate);

		// No slots at all → no availability
		if (slots.length === 0) return false;

		// If not today, any slot means it's available
		if (!isSameDay(checkDate, new Date())) {
			return true;
		}

		const now = new Date();
		const dateStr = format(checkDate, 'yyyy-MM-dd');

		// Check if at least ONE slot hasn't started yet
		return slots.some((slot) => {
			const slotStart = parse(
				`${dateStr} ${slot.end_time}`,
				'yyyy-MM-dd HH:mm:ss',
				new Date(),
			);
			return isAfter(slotStart, now);
		});
	};

	// Get availability windows for selected date
	const availableWindows = useMemo(() => {
		if (!selectedDate) return [];
		const dayOfWeek = getDay(selectedDate);
		return availabilities.filter(
			(slot) => getDayNumber(slot.day) === dayOfWeek,
		);
	}, [selectedDate, availabilities]);

	//Step Navigation
	//Next step condition
	const goNext = () => {
		const steps: Step[] = ['date', 'window', 'confirm'];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex < steps.length - 1) {
			setCurrentStep(steps[currentIndex + 1]);
		}
	};
	//Condition the go back button or cancel
	const goBack = () => {
		const steps: Step[] = ['date', 'window', 'confirm'];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex > 0) {
			// Reset dependent selections
			if (currentStep === 'window') {
				setSelectedWindow(null);
			}
			setCurrentStep(steps[currentIndex - 1]);
		}
	};

	//Check if requireds are filled
	const canProceed = (): boolean => {
		switch (currentStep) {
			case 'date':
				return !!selectedDate;
			case 'window':
				return !!selectedWindow;
			case 'confirm':
				return !!purpose.trim();
			default:
				return false;
		}
	};
	const handleSubmit = async () => {
		setIsSubmitting(true);
		const payLoad = {
			adviser_id: project?.adviser_id,
			student_id: studentId,
			date: format(selectedDate?.toISOString() ?? '', 'yyyy-MM-dd'),
			start_time: selectedWindow?.start_time.slice(0, 5),
			end_time: selectedWindow?.end_time.slice(0, 5),
			purpose: purpose.trim(),
		};

		try {
			const res = await fetch(`${apiStudentUrl}/weekly/add`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payLoad),
			});
			const result = await res.json();

			if (result.status === 500) {
				toast.error(result.message);
				console.log(result.error);
				return;
			}

			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => {
						toast.error(message);
					}),
				);
				return;
			}

			if (!res.ok) {
				console.log(result.status);
				console.log('Failed to fetch data ' + JSON.stringify(payLoad));
				return;
			}

			if (result.status === 201) {
				toast.success(result.message);
				refresh?.();
				handleOpenChange(open);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const getTime = (dateForDay: string, timeSlot: string) => {
		return parse(
			`${dateForDay} ${timeSlot}`,
			'yyyy-MM-dd HH:mm:ss',
			new Date(),
		);
	};

	const dateForDay = format(selectedDate ?? new Date(), 'yyyy-MM-dd');
	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="sm:max-w-[600px] bg-card border-border p-0 gap-0 overflow-hidden">
					{/* Header */}
					<AlertDialogHeader className="p-6 pb-4 border-b border-border">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div>
								<DialogTitle className="text-xl font-semibold">
									Book Consultation
								</DialogTitle>
								<p className="text-sm text-muted-foreground">
									with {project?.adviser.name} • {project?.adviser.duration} min
									session
								</p>
							</div>
						</div>
					</AlertDialogHeader>

					{/* Progress Steps */}
					<div className="px-6 py-4 border-b border-border bg-muted/30">
						<div className="grid grid-cols-[1fr_1fr_auto] w-full">
							{steps.map((step, index) => {
								const StepIcon = step.icon;
								const isActive = step.id === currentStep;
								const isCompleted = index < stepIndex;

								return (
									<div
										key={step.id}
										className="flex items-center gap-2.5 w-full justify-between"
									>
										<div
											className={cn(
												'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
												isActive && 'bg-primary text-primary-foreground',
												isCompleted && 'bg-primary/20 text-primary',
												!isActive &&
													!isCompleted &&
													'bg-muted text-muted-foreground',
											)}
										>
											<StepIcon className="h-4 w-4" />
											<span className="hidden sm:inline">{step.label}</span>
										</div>
										{index < steps.length - 1 && (
											<div
												className={cn(
													'h-0.5 w-8 mx-2',
													index < stepIndex ? 'bg-primary' : 'bg-border',
												)}
											/>
										)}
										<div />
									</div>
								);
							})}
						</div>
					</div>

					{/* Step Content */}
					<div className="p-6 min-h-80">
						{/* Step 1: Select Date */}
						{currentStep === 'date' && (
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-lg">Select a Date</h3>
									<p className="text-sm text-muted-foreground">
										Choose from available days marked on the calendar
									</p>
								</div>
								<div className="flex justify-center">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => {
											setSelectedDate(date);
											setSelectedWindow(null);
										}}
										disabled={(date) => {
											const checkDate = new Date(date);
											checkDate.setHours(0, 0, 0, 0);

											return (
												checkDate < today ||
												!dateHasAvailability(date) ||
												!dateHasFutureAvailability(date) ||
												checkExistigSchedule(date)
											);
										}}
										className="rounded-md border border-border pointer-events-auto"
										modifiers={{
											available: (date) =>
												dateHasAvailability(date) && date >= today,
										}}
										modifiersStyles={{
											available: {
												backgroundColor: 'hsl(var(--primary) / 0.1)',
												borderRadius: '4px',
											},
										}}
									/>
								</div>
								{selectedDate && (
									<div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
										<p className="text-sm font-medium">
											Selected:{' '}
											<span className="text-primary">
												{format(selectedDate, 'EEEE, MMMM d, yyyy')}
											</span>
										</p>
									</div>
								)}
							</div>
						)}
						{/* Step 2: Select Availability Window */}
						{currentStep === 'window' && (
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-lg">Select Time Window</h3>
									<p className="text-sm text-muted-foreground">
										Choose from {project?.adviser.name}'s available time windows
										on {selectedDate && format(selectedDate, 'MMM d')}
									</p>
								</div>
								<div className="grid gap-3">
									{availableWindows
										.sort((a, b) => {
											if (a.start_time !== b.start_time) {
												return a.start_time.localeCompare(b.start_time);
											}
											return a.end_time.localeCompare(b.end_time);
										})
										.map((window) => {
											const startDateTime = getTime(
												dateForDay,
												window.start_time,
											);
											const endDateTime = getTime(dateForDay, window.end_time);
											const slots: { start: string; end: string } = {
												start: window.start_time.slice(0, 5),
												end: window.end_time.slice(0, 5),
											};

											const booked = isSlotBooked(slots);
											const expired =
												isAfter(new Date(), startDateTime) &&
												isAfter(new Date(), endDateTime);
											return (
												<button
													key={window.id}
													onClick={() => !booked && setSelectedWindow(window)}
													disabled={(() => {
														return expired || booked;
													})()}
													className={cn(
														"p-4 rounded-lg border-2 text-left transition-all cursor-pointer disabled:cursor-auto disabled:border-none disabled:bg-muted disabled:text-slate-600! hover:disabled:border-none relative hover:disabled:bg-muted disabled:after:content-[' '] disabled:after:bg-card disabled:after:absolute disabled:after:w-full disabled:after:h-0.5 disabled:after:top-1/2 disabled:after:left-0",
														selectedWindow?.id === window.id
															? 'border-primary bg-primary/10'
															: 'border-border hover:border-primary/50 hover:bg-muted/50',
													)}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<div
																className={cn(
																	'h-10 w-10 rounded-lg flex items-center justify-center',
																	selectedWindow?.id === window.id
																		? 'bg-primary'
																		: 'bg-muted',
																)}
															>
																<Clock
																	className={cn(
																		'h-5 w-5',
																		selectedWindow?.id === window.id
																			? 'text-primary-foreground'
																			: 'text-muted-foreground',
																	)}
																/>
															</div>
															<div>
																<p className="font-semibold text-lg">
																	{to12HourTime(window.start_time)} –{' '}
																	{to12HourTime(window.end_time)}
																</p>
																<p className="text-sm text-muted-foreground">
																	{booked
																		? 'Booked'
																		: expired
																			? 'Expired'
																			: 'Available to book/appoint'}
																</p>
															</div>
														</div>
														{selectedWindow?.id === window.id && (
															<CheckCircle2 className="h-5 w-5 text-primary" />
														)}
													</div>
												</button>
											);
										})}
								</div>
							</div>
						)}
						{/* Step 3: Select Time Slot */}
						{/* {currentStep === 'slot' && selectedWindow && (
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-lg">Select Time Slot</h3>
									<p className="text-sm text-muted-foreground">
										Choose a {project?.adviser.duration}-minute slot within{' '}
										{to12HourTime(selectedWindow.start_time)} –{' '}
										{to12HourTime(selectedWindow.end_time)}
									</p>
								</div>
								<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
									{generateSlotsForWindow(selectedWindow).map((slot, index) => {
										const booked = isSlotBooked(slot);

										const isSelected = selectedSlot?.start === slot.start;

										const startDateTime = parse(
											`${getDateForWeekday(selectedWindow.day)} ${slot.start}`,
											'yyyy-MM-dd HH:mm',
											new Date(),
										);
										
										return (
											<button
												key={index}
												onClick={() => !booked && setSelectedSlot(slot)}
												disabled={booked || isAfter(new Date(), startDateTime)}
												className={cn(
													'p-3 rounded-lg border text-center transition-all disabled:cursor-auto cursor-pointer',
													booked &&
														'opacity-40 cursor-not-allowed bg-muted border-border',
													!booked &&
														!isSelected &&
														'border-border hover:border-primary hover:bg-primary/5',
													isSelected &&
														'border-primary bg-primary text-primary-foreground',
													isAfter(new Date(), startDateTime) &&
														'border-none bg-muted text-slate-600! hover:bg-muted',
												)}
											>
												<p
													className={cn(
														'font-mono font-semibold text-sm',
														isSelected && 'text-primary-foreground',
													)}
												>
													{to12HourTime(slot.start)}
												</p>
												<p
													className={cn(
														'text-xs mt-0.5',
														isSelected
															? 'text-primary-foreground/80'
															: 'text-muted-foreground',
													)}
												>
													{booked
														? 'Booked'
														: `${project?.adviser.duration} min`}
												</p>
											</button>
										);
									})}
								</div>
								{selectedSlot && (
									<div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-4 w-4 text-primary" />
											<p className="text-sm font-medium">
												{to12HourTime(selectedSlot.start)} –{' '}
												{to12HourTime(selectedSlot.end)}
											</p>
										</div>
									</div>
								)}
							</div>
						)} */}
						{/* Step 4: Confirm Booking */}
						{currentStep === 'confirm' && selectedDate && selectedWindow && (
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-lg">Confirm Booking</h3>
									<p className="text-sm text-muted-foreground">
										Review your consultation details and add a purpose
									</p>
								</div>

								{/* Booking Summary */}
								<div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
									<div className="flex items-center gap-3">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
											<User className="h-6 w-6 text-primary" />
										</div>
										<div>
											<p className="font-semibold">{project?.adviser.name}</p>
											<p className="text-sm text-muted-foreground">
												{project?.adviser.department.name}
											</p>
										</div>
									</div>
									<div className="h-px bg-border" />
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wider">
												Date
											</p>
											<p className="font-semibold">
												{format(selectedDate, 'MMMM d, yyyy')}
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wider">
												Time
											</p>
											<p className="font-semibold">
												{to12HourTime(selectedWindow.start_time)} –{' '}
												{to12HourTime(selectedWindow.end_time)}
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wider">
												Duration
											</p>
											<p className="font-semibold">
												{differenceInMinutes(
													getTime(dateForDay, selectedWindow.end_time),
													getTime(dateForDay, selectedWindow.start_time),
												)}{' '}
												minutes
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wider">
												Day
											</p>
											<p className="font-semibold">
												{format(selectedDate, 'EEEE')}
											</p>
										</div>
									</div>
								</div>

								{/* Purpose Input */}
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Purpose of Consultation *
									</label>
									<Textarea
										value={purpose}
										onChange={(e) => setPurpose(e.target.value)}
										placeholder="Describe what you'd like to discuss..."
										rows={3}
										className="resize-none"
									/>
								</div>
							</div>
						)}
					</div>
					{/* Footer with Navigation */}
					<div className="p-6 pt-4 border-t border-border flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={
								currentStep === 'date' ? () => handleOpenChange(false) : goBack
							}
							disabled={isSubmitting}
							className={cn(
								'hover:bg-red-500',
								currentStep !== 'date' && 'hover:bg-slate-500',
							)}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							{currentStep === 'date' ? 'Cancel' : 'Back'}
						</Button>

						{currentStep !== 'confirm' ? (
							<Button onClick={goNext} disabled={!canProceed()}>
								Next
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={!canProceed() || isSubmitting}
								className="min-w-[140px]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Booking...
									</>
								) : (
									<>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										Confirm Booking
									</>
								)}
							</Button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BookConsultationDialog;
