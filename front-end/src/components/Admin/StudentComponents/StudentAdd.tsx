import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import type { StudentAddProps } from '../interface/student';

const studentSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		student_id: z.string().min(1, 'Student ID is required'),
		role: z.number().optional(),
		mobile_num: z.string().optional().nullable(),
		selectedDepartmentId: z.number(),
		program: z.number().min(1, 'Program is required'),
		section: z.string().min(1, 'Section is required'),
		semester: z.number().min(1, 'Must select a semester').max(2),
		thesis_title: z.string().min(1, 'Thesis Title is required'),
		year_Level: z.number().min(1, 'Must select a year level').max(4),
		facebook_profile: z.string().optional(),
	})
	.refine((data) => data.selectedDepartmentId > 0, {
		message: 'Select a department',
		path: ['selectedDepartmentId'],
	});

const StudentAdd = ({
	roles,
	departments,
	programs,
	onSuccess,
}: StudentAddProps) => {
	const [open, setOpen] = useState(false);
	//const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	type formValues = z.infer<typeof studentSchema>;
	const defaultValues: formValues = {
		student_id: '',
		program: 0,
		section: '',
		name: '',
		role: 0,
		mobile_num: '',
		semester: 0,
		thesis_title: '',
		year_Level: 0,
		facebook_profile: '',
		selectedDepartmentId: 0,
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
				name: value.name,
				student_id: value.student_id,
				department_id: value.selectedDepartmentId,
				program_id: value.program,
				section: value.section,
				mobile_num: value.mobile_num,
				semester: value.semester,
				facebook_profile: value.facebook_profile,
				year_level: value.year_Level,
				thesis_title: value.thesis_title,
				role_id: value.role === 0 ? null : value.role,
			};
			try {
				const res = await fetch(`${apiUrl}/students/add`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(payLoad),
				});
				const result = await res.json();
				if (result.status == 422) {
					const errors = result.errors as Record<string, string[]>;
					Object.values(errors).forEach((errorMessages) =>
						errorMessages.forEach((message) => toast.error(message))
					);
					return;
				} else if (result.status == 500) {
					toast.error(result.message);
					console.log(result.error);
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
			} finally {
				setLoading(false);
			}
		},
	});
	const [selectedDepartmentId, setSelectedDepartmentId] = useState(0);

	const filteredPrograms = programs.filter(
		(p) => p.department_id === selectedDepartmentId
	);

	const filteredRoles = roles.filter(
		(r) => r.department_id === selectedDepartmentId || r.globalRole === 1
	);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="text-white cursor-pointer" variant="primary">
					Add Student <Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="text-white max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Student</DialogTitle>
					<DialogDescription>
						Fill in the student information below to add.
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
											<FieldLabel htmlFor={field.name}>Student ID: </FieldLabel>
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
										<FieldLabel htmlFor={field.name}>Thesis Title: </FieldLabel>
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
											<FieldLabel htmlFor={field.name}>Year Level:</FieldLabel>
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
													<SelectValue placeholder="Select Year Level" />
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
						<form.Field
							name="selectedDepartmentId"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Departments:</FieldLabel>
										<Select
											name={field.name}
											defaultValue={
												field.state.value ? String(field.state.value) : ''
											}
											onValueChange={(v) => {
												field.handleChange(Number(v));
												setSelectedDepartmentId(Number(v));
											}}
										>
											<SelectTrigger
												className="w-auto"
												aria-invalid={isInvalid}
												id={field.name}
											>
												<SelectValue placeholder="Select a Department" />
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
							name="program"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Programs:</FieldLabel>
										<Select
											name={field.name}
											defaultValue={
												field.state.value ? String(field.state.value) : ''
											}
											onValueChange={(v) => field.handleChange(Number(v))}
											disabled={selectedDepartmentId === 0 ? true : false}
										>
											<SelectTrigger
												className="w-auto"
												aria-invalid={isInvalid}
												id={field.name}
											>
												<SelectValue
													placeholder={
														selectedDepartmentId === 0
															? 'Select a department first'
															: 'Select a program'
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{filteredPrograms.map((prog) => (
													<SelectItem key={prog.id} value={String(prog.id)}>
														{prog.name}
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
						<div className="grid grid-cols-2 gap-4">
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
												defaultValue={
													field.state.value ? String(field.state.value) : ''
												}
												onValueChange={(v) => field.handleChange(Number(v))}
												disabled={selectedDepartmentId === 0 ? true : false}
											>
												<SelectTrigger
													className="w-auto"
													aria-invalid={isInvalid}
													id={field.name}
												>
													<SelectValue
														placeholder={
															selectedDepartmentId === 0
																? 'Select a department'
																: 'Select a role'
														}
													/>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="0">Not Assigned</SelectItem>
													{filteredRoles.map((role) => (
														<SelectItem key={role.id} value={String(role.id)}>
															{role.name}
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
												value={field.state.value ?? ''}
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
							variant="primary"
							disabled={loading}
						>
							{loading ? <Spinner /> : ''}
							{loading ? 'Adding...' : 'Add'}
							{loading ? '' : <Plus />}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default StudentAdd;
