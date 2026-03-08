import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@tanstack/react-form';
import { ArrowRightToLine, CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';
import type { AddFeatureProps } from '../interface/developmentprocess';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { apiStudentUrl } from '@/Routes/http';
import { projectId, userToken } from '@/components/functions/functions';
import { toast } from 'sonner';

const featureScehma = z.object({
	feature: z.string().min(1, 'Feature title required'),
	start_date: z.date(),
	end_date: z.date(),
	status: z.enum(['not-started', 'in-progress', 'completed']),
});
const AddFeatureDialog = ({
	development,
	refresh,
	open,
	setOpen,
	setSelectedFeature,
}: AddFeatureProps) => {
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState<Date | undefined>(
		development ? development.start_date : undefined,
	);
	const [endDate, setEndDate] = useState<Date | undefined>(
		development ? development.end_date : undefined,
	);
	type formValues = z.infer<typeof featureScehma>;

	const defaultValues: formValues = {
		feature: development ? development.feature : '',
		start_date: development ? development.start_date : new Date(),
		end_date: development ? development.end_date : new Date(),
		status: development
			? (development.status as 'not-started' | 'in-progress' | 'completed')
			: 'not-started',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: featureScehma,
			onSubmit: featureScehma,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				foreign_proponents_id: projectId.proponents_id,
				feature: value.feature,
				start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
				end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
				status: value.status,
			};
			try {
				const apiLink = development
					? `${apiStudentUrl}/development-process/edit/${development.foreign_proponets_id}`
					: `${apiStudentUrl}/development-process/store`;
				const res = await fetch(apiLink, {
					method: development ? 'PUT' : 'POST',
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
				}
				if (!res.ok) {
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return JSON.stringify(payLoad);
				}
				form.reset();
				if (result.status === 201 || result.status === 200) {
					toast.success(result.message);
					setOpen(false);
					refresh?.();
				}
				setSelectedFeature(null);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	const stringButton = development ? 'Update Feature' : 'Add Feature';
	const loadingString = development ? 'Updating...' : 'Adding...';
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>
							{development ? 'Edit Feature' : 'Add New Feature'}
						</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<form.Field
								name="feature"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Feature Title
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="e.g., User Authentication Module"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<div className="grid grid-cols-2 gap-3">
								<form.Field
									name="start_date"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor="deadline">Start Date *</FieldLabel>
												<Popover>
													<PopoverTrigger asChild aria-invalid={isInvalid}>
														<Button
															variant="outline"
															className={cn(
																'w-full justify-start text-left font-normal',
																!startDate && 'text-muted-foreground',
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{startDate
																? format(startDate, 'PPP')
																: 'Pick date'}
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={startDate}
															onSelect={setStartDate}
															initialFocus
															className="p-3 pointer-events-auto"
														/>
													</PopoverContent>
												</Popover>
											</Field>
										);
									}}
								/>
								<form.Field
									name="end_date"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor="deadline">
													Target Date *
												</FieldLabel>
												<Popover>
													<PopoverTrigger asChild aria-invalid={isInvalid}>
														<Button
															variant="outline"
															className={cn(
																'w-full justify-start text-left font-normal',
																!endDate && 'text-muted-foreground',
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{endDate ? format(endDate, 'PPP') : 'Pick date'}
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={endDate}
															onSelect={setEndDate}
															initialFocus
															className="p-3 pointer-events-auto"
														/>
													</PopoverContent>
												</Popover>
											</Field>
										);
									}}
								/>
							</div>
							<form.Field
								name="status"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Status</FieldLabel>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(v) =>
													field.handleChange(
														v as 'not-started' | 'in-progress' | 'completed',
													)
												}
											>
												<SelectTrigger
													id={field.name}
													className="w-auto"
													aria-invalid={isInvalid}
												>
													<SelectValue placeholder="Select Status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="not-started">
														Not Started
													</SelectItem>
													<SelectItem value="in-progress">
														In Progress
													</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
						</FieldGroup>
						<div className="flex justify-end pt-4 gap-3">
							<Button
								className="cursor-pointer"
								type="button"
								variant="outline"
								onClick={() => {
									setOpen(false);
									form.reset();
									refresh?.();
								}}
							>
								Cancel
							</Button>
							<Button
								className="cursor-pointer"
								type="submit"
								variant={development ? 'edit' : 'primary'}
								disabled={loading || !startDate || !endDate}
							>
								{loading ? <Spinner /> : ''}
								{loading ? loadingString : stringButton}
								{loading ? '' : development ? <ArrowRightToLine /> : <Plus />}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AddFeatureDialog;
