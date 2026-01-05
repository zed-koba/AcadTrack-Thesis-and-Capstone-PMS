import { apiUrl } from '@/components/Routes/http';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { ArrowRightToLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import type { ProgramEditProps } from '../interface/programs';

const departmentSchema = z
	.object({
		name: z
			.string()
			.min(2, 'Program name must be at least 2 character')
			.max(100),
		code: z
			.string()
			.min(2, 'Program code must be at least 2 characters')
			.max(10)
			.toUpperCase(),
		description: z.string().max(300).optional().nullable(),
		selectedDepartmentId: z.number(),
		status: z.enum(['active', 'inactive']),
	})
	.refine((data) => data.selectedDepartmentId > 0, {
		message: 'Please select a department',
		path: ['selectedDepartmentId'],
	});

const ProgramEdit = ({
	open,
	setOpen,
	program,
	departments,
	onSuccess,
}: ProgramEditProps) => {
	const [loading, setLoading] = useState(false);
	type formValues = z.infer<typeof departmentSchema>;
	const defaultValues: formValues = {
		name: program.name,
		code: program.code,
		description: program.description ?? '',
		selectedDepartmentId: program.department_id,
		status: program.status as 'active' | 'inactive',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: departmentSchema,
			onSubmit: departmentSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				name: value.name,
				code: value.code,
				department_id: value.selectedDepartmentId,
				description: value.description,
				status: value.status,
			};
			try {
				const res = await fetch(`${apiUrl}/programs/edit/${program.id}`, {
					method: 'PUT',
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
				if (result.status == 200) {
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
	useEffect(() => {
		if (program) {
			form.reset({
				name: program.name,
				description: program.description,
				code: program.code,
				selectedDepartmentId: program.department_id,
				status: program.status as 'active' | 'inactive',
			});
		}
	}, [form, program]);
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader className="gap-0!">
						<DialogTitle className="font-medium text-lg">
							Edit Program
						</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Update the program details below.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="grid grid-row-5 grid-cols-1 min-w-0 gap-4 mt-2">
							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Program Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder={
													'Ex. Bachelor of Science in Computer Science'
												}
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
								name="code"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Department Code
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder={'Ex. BSCS'}
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
										</Field>
									);
								}}
							/>
							<form.Field
								name="description"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} orientation="responsive">
											<FieldLabel htmlFor={field.name}>
												Description (Optional)
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value ? field.state.value : ''}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder={'Brief description about the program...'}
												autoComplete="off"
												className="resize-none w-full"
											/>
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
									variant="edit"
									disabled={loading}
								>
									{loading ? <Spinner /> : ''}
									{loading ? 'Adding...' : 'Update Program'}
									{loading ? '' : <ArrowRightToLine />}
								</Button>
							</div>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProgramEdit;
