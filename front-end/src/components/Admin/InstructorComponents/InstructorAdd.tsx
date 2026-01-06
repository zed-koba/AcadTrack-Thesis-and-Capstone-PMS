import { apiUrl } from '@/components/Routes/http';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useForm } from '@tanstack/react-form';
import { CircleAlert, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { NAME_SUFFIX } from '../interface/instructor';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import type { InstructorAddProps } from '../interface/instructor';

const instructorSchema = z
	.object({
		first_name: z
			.string()
			.min(2, 'First name must be at least 2 characters')
			.toUpperCase(),
		last_name: z
			.string()
			.min(2, 'Last name must be at least 2 characters')
			.toUpperCase(),
		suffix: z.string().optional(),
		contact_number: z.string().optional(),
		selectedDepartmentId: z.number(),
		status: z.enum(['active', 'inactive']),
	})
	.refine((data) => data.selectedDepartmentId > 0, {
		message: 'Please select a department',
		path: ['selectedDepartmentId'],
	});

const InstructorAdd = ({ departments, onSuccess }: InstructorAddProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	type formValues = z.infer<typeof instructorSchema>;
	const defaultValues: formValues = {
		first_name: '',
		last_name: '',
		suffix: 'none',
		contact_number: '',
		selectedDepartmentId: 0,
		status: 'active',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: instructorSchema,
			onSubmit: instructorSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				name:
					value.first_name +
					' ' +
					value.last_name +
					' ' +
					(value.suffix === 'none' ? '' : value.suffix),
				contact_number: value.contact_number,
				department_id: value.selectedDepartmentId,
				status: value.status,
			};
			try {
				const res = await fetch(`${apiUrl}/instructors/add`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(payLoad),
				});

				const result = await res.json();
				if (result.status == 422) {
					const errors = result.errors as Record<string, string[]>;
					Object.values(errors).forEach((errorMessages) =>
						errorMessages.forEach((message) => {
							toast.error(message);
						})
					);
					return;
				} else if (result.status == 500) {
					toast.error(result.message);
					console.log(result.error);
					console.log(payLoad);
					return;
				}
				if (!res.ok) {
					console.log(result.status);
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return;
				}
				form.reset();
				if (result.status == 201) {
					toast.success(result.message);
					setOpen(false);
					onSuccess?.();
				}
			} catch (error) {
				console.log(error);
				console.log(payLoad);
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="primary">
						<Plus />
						Add Instructor
					</Button>
				</DialogTrigger>
				<DialogContent className="text-white">
					<DialogHeader className="gap-0!">
						<DialogTitle className="font-medium text-lg">
							Add New Instructor
						</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Fill in the details to create a new instructor.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="grid grid-row-5 grid-cols-1 min-w-0 gap-4 mt-2">
							<div className="grid grid-cols-[1fr_1fr_100px] min-w-0 gap-1">
								<form.Field
									name="first_name"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>First Name</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder={'Ex. Nathan'}
													autoComplete="off"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
								<form.Field
									name="last_name"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder={'Ex. Pabingwit'}
													autoComplete="off"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
								<form.Field
									name="suffix"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Suffix
													<Tooltip>
														<TooltipTrigger asChild>
															<CircleAlert
																size={14}
																className="text-muted-foreground"
															/>
														</TooltipTrigger>
														<TooltipContent>Optional</TooltipContent>
													</Tooltip>
												</FieldLabel>
												<Select
													name={field.name}
													defaultValue={field.state.value}
													onValueChange={(v) =>
														field.handleChange(v === 'none' ? '' : v)
													}
												>
													<SelectTrigger
														className="w-auto"
														aria-invalid={isInvalid}
														id={field.name}
													>
														<SelectValue placeholder="Select Suffix" />
														<SelectContent>
															<SelectItem value="none">None</SelectItem>
															{NAME_SUFFIX.map((suffix) => (
																<SelectItem key={suffix} value={suffix}>
																	{suffix}
																</SelectItem>
															))}
														</SelectContent>
													</SelectTrigger>
												</Select>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>

							<form.Field
								name="selectedDepartmentId"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Department</FieldLabel>
											<Select
												name={field.name}
												defaultValue={
													field.state.value ? String(field.state.value) : ''
												}
												onValueChange={(v) => field.handleChange(Number(v))}
											>
												<SelectTrigger
													className="w-auto"
													aria-invalid={isInvalid}
													id={field.name}
												>
													<SelectValue placeholder="Select Department" />
												</SelectTrigger>
												<SelectContent>
													{departments?.map((dept) => (
														<SelectItem key={dept.id} value={String(dept.id)}>
															{dept.name}
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
							<form.Field
								name="status"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} orientation="responsive">
											<FieldLabel htmlFor={field.name}>Status</FieldLabel>
											<Select
												name={field.name}
												defaultValue={field.state.value}
												onValueChange={(v) =>
													field.setValue(v as 'active' | 'inactive')
												}
											>
												<SelectTrigger
													className="w-auto"
													aria-invalid={isInvalid}
													id={field.name}
												>
													<SelectValue placeholder="Select Status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="active">Active</SelectItem>
													<SelectItem value="inactive">Inactive</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<div className="flex justify-end pt-4 gap-3">
								<Button
									className="cursor-pointer"
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button
									className="cursor-pointer"
									type="submit"
									variant="primary"
									disabled={loading}
								>
									{loading ? <Spinner /> : ''}
									{loading ? 'Adding...' : 'Add Instructor'}
									{loading ? '' : <Plus />}
								</Button>
							</div>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default InstructorAdd;
