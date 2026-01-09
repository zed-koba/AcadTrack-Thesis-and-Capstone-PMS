import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { useForm } from '@tanstack/react-form';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import z from 'zod';
import {
	DAYS,
	getValidEndTimes,
	getValidStartTimes,
	to12HourTime,
	to24HourTime,
	type AvailabilityConsultationProps,
} from '../../interface/consultation';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { apiAdviserUrl } from '@/components/Routes/http';
import { toast } from 'sonner';
import DeleteSchedule from './DeleteSchedule';

const availabilitySchema = z.object({
	day: z.string().min(1, 'Day is required'),
	start_time: z.string().min(1, 'Start time is required'),
	end_time: z.string().min(1, 'End time is required'),
});

const AvailabilityConsultation = ({
	availabilities,
	refresh,
}: AvailabilityConsultationProps) => {
	const [loading, setLoading] = useState(false);
	const [selectedDay, setSelectedDay] = useState<string | undefined>();
	const [startTime, setStartTime] = useState<string | undefined>();
	const [endTime, setEndTime] = useState<string | undefined>();
	const [scheduleId, setScheduleId] = useState(0);
	const [open, setOpen] = useState(false);

	const AVAIL_TIME = [
		'7:00 AM',
		'8:00 AM',
		'9:00 AM',
		'10:00 AM',
		'11:00 AM',
		'12:00 PM',
		'1:00 PM',
		'2:00 PM',
		'3:00 PM',
		'4:00 PM',
		'5:00 PM',
		'6:00 PM',
		'7:00 PM',
	];
	type formValues = z.infer<typeof availabilitySchema>;
	const defaultValues: formValues = {
		day: '',
		start_time: '',
		end_time: '',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: availabilitySchema,
			onSubmit: availabilitySchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);

			try {
				const payLoad = {
					day: value.day,
					start_time: to24HourTime(value.start_time),
					end_time: to24HourTime(value.end_time),
				};
				const res = await fetch(`${apiAdviserUrl}/availabilities/add`, {
					method: 'POST',
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
						errorMessages.forEach((message) => toast.error(message))
					);
					return;
				} else if (result.status == 500) {
					toast.error(result.message);
					console.log(result.error);
					console.log(payLoad);
					return;
				}
				if (!res.ok) {
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return JSON.stringify(payLoad);
				}
				form.reset();
				if (result.status === 201) {
					toast.success(result.message);
					refresh?.();
					setStartTime(undefined);
					setEndTime(undefined);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	const validEndTimes = useMemo(() => {
		if (!selectedDay || !startTime) return [];

		return getValidEndTimes(AVAIL_TIME, startTime, selectedDay, availabilities);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startTime, selectedDay, availabilities]);

	const validStartTimes = useMemo(() => {
		if (!selectedDay) return [];
		return getValidStartTimes(AVAIL_TIME, selectedDay, availabilities);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDay, availabilities]);
	return (
		<>
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-xl font-semibold flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Manage Availability
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="p-4 rounded-lg bg-muted/50 border border-border space-y-4">
						<h4 className="font-medium text-sm">Add New Time Slot</h4>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<div className="space-y-2">
								<FieldGroup className="grid grid-cols-1 sm:grid-cols-4 gap-4">
									<form.Field
										name="day"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Day</FieldLabel>
													<Select
														name={field.name}
														defaultValue={field.state.value}
														value={selectedDay}
														onValueChange={(v) => {
															field.handleChange(v);
															setSelectedDay(v);
															setStartTime(undefined);
															setEndTime(undefined);
														}}
													>
														<SelectTrigger
															id={field.name}
															className="auto"
															aria-invalid={isInvalid}
														>
															<SelectValue placeholder="Select a day" />
														</SelectTrigger>
														<SelectContent>
															{DAYS.map((day) => (
																<SelectItem key={day} value={day}>
																	{day}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</Field>
											);
										}}
									/>
									<form.Field
										name="start_time"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Start Time
													</FieldLabel>
													<Select
														name={field.name}
														defaultValue={field.state.value}
														value={startTime}
														onValueChange={(v) => {
															field.handleChange(v);
															setStartTime(v);
															setEndTime(undefined);
														}}
														disabled={!selectedDay}
													>
														<SelectTrigger
															id={field.name}
															className="auto"
															aria-invalid={isInvalid}
														>
															<SelectValue placeholder="Select start time" />
														</SelectTrigger>
														<SelectContent>
															{validStartTimes.map((time) => (
																<SelectItem key={time} value={time}>
																	{time}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</Field>
											);
										}}
									/>
									<form.Field
										name="end_time"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>End Time</FieldLabel>
													<Select
														name={field.name}
														defaultValue={field.state.value}
														value={endTime}
														onValueChange={(v) => {
															field.handleChange(v);
															setEndTime(undefined);
														}}
														disabled={!startTime || !selectedDay}
													>
														<SelectTrigger
															id={field.name}
															className="auto"
															aria-invalid={isInvalid}
														>
															<SelectValue placeholder="Select end time" />
														</SelectTrigger>
														<SelectContent>
															{validEndTimes.map((time) => (
																<SelectItem key={time} value={time}>
																	{time}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
									<div className="flex flex-col start-end justify-end">
										<Button
											className="cursor-pointer"
											type="submit"
											variant="primary"
											disabled={loading}
										>
											{loading ? <Spinner /> : ''}
											{loading ? 'Adding...' : 'Add Slot'}
											{loading ? '' : <Plus />}
										</Button>
									</div>
								</FieldGroup>
							</div>
						</form>
					</div>
					<div className="space-y-4">
						<h4 className="font-medium text-sm text-muted-foreground">
							Current Availability
						</h4>
						{DAYS.map((day) => (
							<>
								<div key={day} className="space-y-2">
									<h5 className="text-sm font-medium">{day}</h5>
									{availabilities.filter((avail) => avail.day === day)
										.length === 0 ? (
										<p className="text-xs text-muted-foreground">
											No availability set
										</p>
									) : (
										<div className="flex flex-wrap gap-2">
											{availabilities
												.filter((avail) => avail.day === day)
												.map((sched) => (
													<div
														key={sched.start_time + '-' + sched.end_time}
														className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/20 border text-sm"
													>
														<span>
															{to12HourTime(sched.start_time)} - {' '}
															{to12HourTime(sched.end_time)}
														</span>
														<button className="text-destructive hover:text-destructive/80 transition-colors">
															<Trash2
																className="h-4 w-4 cursor-pointer"
																onClick={() => {
																	setScheduleId(sched.id);
																	setOpen(true);
																}}
															/>
														</button>
													</div>
												))}
										</div>
									)}
								</div>
							</>
						))}
					</div>
					{scheduleId && (
						<DeleteSchedule
							open={open}
							setOpen={setOpen}
							sched_id={scheduleId}
							refresh={refresh}
						/>
					)}
				</CardContent>
			</Card>
		</>
	);
};

export default AvailabilityConsultation;
