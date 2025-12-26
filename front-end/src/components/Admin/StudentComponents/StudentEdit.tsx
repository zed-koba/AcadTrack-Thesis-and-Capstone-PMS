import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRightToLine } from 'lucide-react';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { apiUrl } from '@/components/Routes/http';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import type { StudentEditProps } from '../interface/student';

const studentSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	student_id: z.string().min(1, 'Student ID is required'),
	role: z.string().min(1, 'Role is required'),
	mobile_num: z
		.string()
		.regex(/^(09\d{9}|\+639\d{9})$/, {
			message: 'Invalid mobile number format',
		})
		.optional(),
	program: z.string().min(1, 'Program is required'),
	section: z.string().min(1, 'Section is required'),
	semester: z.number().min(1, 'Must select a semester').max(2),
	thesis_title: z.string().min(1, 'Thesis Title is required'),
	year_Level: z.number().min(1, 'Must select a year level').max(4),
	facebook_profile: z.string().optional(),
});
const StudentEdit = ({
	open,
	setOpen,
	student,
	onSuccess,
}: StudentEditProps) => {
	const [loading, setLoading] = useState(false);
	type formValues = z.infer<typeof studentSchema>;
	const defaultValues: formValues = {
		student_id: student.student_id,
		program: student.program,
		section: student.section,
		name: student.name,
		role: student.role,
		mobile_num: student.mobile_num,
		semester: student.semester,
		thesis_title: student.thesis_title,
		year_Level: student.year_level,
		facebook_profile: student.facebook_profile,
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: studentSchema,
			onSubmit: studentSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				student_id: value.student_id,
				role: value.role,
				year_level: value.year_Level,
				name: value.name,
				mobile_num: value.mobile_num,
				semester: value.semester,
				thesis_title: value.thesis_title,
				program: value.program,
				section: value.section,
				facebook_profile: value.facebook_profile,
			};
			try {
				const res = await fetch(`${apiUrl}/students/edit/${student.id}`, {
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
						errorMessages.forEach((message) => toast.error(message))
					);
					setLoading(false);
					return;
				}
				if (!res.ok) {
					console.log('Failed to fetch data' + JSON.stringify({ value }));
					setLoading(false);
					return JSON.stringify({ value });
				}
				form.reset();
				toast.success('Successfully updated proponent');
				console.log('CALLED');
				setOpen(false);
				onSuccess?.();
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		},
	});
	useEffect(() => {
		if (student) {
			form.reset({
				student_id: student.student_id,
				program: student.program,
				section: student.section,
				name: student.name,
				role: student.role,
				mobile_num: student.mobile_num,
				semester: student.semester,
				thesis_title: student.thesis_title,
				year_Level: student.year_level,
				facebook_profile: student.facebook_profile,
			});
		}
	}, [form, student]);
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>Edit Student: {student.student_id}</DialogTitle>
						<DialogDescription>
							Update the details of this project member.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<div className="grid grid-cols-2 gap-4">
								<form.Field
									name="student_id"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Student ID:{' '}
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. 22-2000241"
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
									name="name"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Name: </FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. John Fritz Selloria"
													autoComplete="off"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>
							<form.Field
								name="thesis_title"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Thesis Title:{' '}
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Ex. Web-Based Thesis Management System"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<div className="grid grid-cols-2 gap-4">
								<form.Field
									name="semester"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Semester:</FieldLabel>
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
														<SelectValue placeholder="Select Semester" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">1st Semester</SelectItem>
														<SelectItem value="2">2nd Semester</SelectItem>
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
									name="year_Level"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Year Level:
												</FieldLabel>
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
														<SelectValue placeholder="Select Semester" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="3">3rd Year</SelectItem>
														<SelectItem value="4">4th Year</SelectItem>
													</SelectContent>
												</Select>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>
							<div className="grid grid-cols-3 gap-4">
								<form.Field
									name="program"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Program:</FieldLabel>
												<Select
													name={field.name}
													defaultValue={field.state.value}
													onValueChange={(v) => field.handleChange(v)}
												>
													<SelectTrigger
														className="w-auto"
														aria-invalid={isInvalid}
														id={field.name}
													>
														<SelectValue placeholder="Select Program" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="BSCS">BSCS</SelectItem>
														<SelectItem value="BSIT">BSIT</SelectItem>
														<SelectItem value="BSCpE">BSCpE</SelectItem>
														<SelectItem value="BSIS">BSIS</SelectItem>
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
									name="section"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Section:</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. CS801P"
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
									name="role"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Role:</FieldLabel>
												<Select
													name={field.name}
													defaultValue={field.state.value}
													onValueChange={(v) => field.handleChange(v)}
												>
													<SelectTrigger
														className="w-auto"
														aria-invalid={isInvalid}
														id={field.name}
													>
														<SelectValue placeholder="Select Role" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="not assigned">
															Not Assigned
														</SelectItem>
														<SelectItem value="programmer">
															Programmer
														</SelectItem>
														<SelectItem value="user interface">UI</SelectItem>
														<SelectItem value="database">Database</SelectItem>
														<SelectItem value="system analyst">
															System Analyst
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
							</div>
							<div className="grid grid-cols-2 gap-4">
								<form.Field
									name="facebook_profile"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Facebook Name:
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. Nathan Pabingwit"
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
									name="mobile_num"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Mobile Number:
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. 09xxxxxxxxx"
													autoComplete="off"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>
						</FieldGroup>
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
								{loading ? 'Updating...' : 'Update'}
								{loading ? '' : <ArrowRightToLine />}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default StudentEdit;
