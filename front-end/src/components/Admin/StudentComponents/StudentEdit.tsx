import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';

const studentSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		student_id: z.string().min(1, 'Student ID is required'),
		role: z.number().optional().nullable(),
		mobile_num: z.string().optional().nullable(),
		selectedDepartmentId: z.number(),
		program: z.number().min(1, 'Program is required'),
		section: z.string().min(1, 'Section is required'),
		semester: z.number().min(1, 'Must select a semester').max(2),
		instructor: z.number().min(1, 'Thesis Title is required'),
		year_Level: z.number().min(1, 'Must select a year level').max(4),
		facebook_profile: z.string().optional().nullable(),
	})
	.refine((data) => data.selectedDepartmentId > 0, {
		message: 'Select a department',
		path: ['selectedDepartmentId'],
	});

const StudentEdit = ({
	open,
	setOpen,
	student,
	roles,
	departments,
	programs,
	instructors,
	onSuccess,
}: StudentEditProps) => {
	const [loading, setLoading] = useState(false);
	const [selectInstructorId, setSelectInstructorId] = useState(student.instructor_id);
	const [instructorOpen, setInstructorOpen] = useState(false);

	type formValues = z.infer<typeof studentSchema>;
	const defaultValues: formValues = {
		student_id: student.student_id,
		program: student.program_id,
		section: student.section,
		name: student.name,
		role: student.role_id === null ? 0 : student.role_id,
		mobile_num: student.mobile_num,
		semester: student.semester,
		instructor: student.instructor_id,
		year_Level: student.year_level,
		facebook_profile: student.facebook_profile,
		selectedDepartmentId: student.department_id,
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
				instructor_id: value.instructor,
				role_id: value.role === 0 ? null : value.role,
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
				if (result.status == 200) {
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
	const [selectedDepartmentId, setSelectedDepartmentId] = useState(
		student.department_id
	);

	const filteredPrograms = programs.filter(
		(p) => p.department_id === selectedDepartmentId
	);

	const filteredRoles = roles.filter(
		(r) => r.department_id === selectedDepartmentId || r.globalRole === 1
	);
	const filteredInstructor = instructors.filter((ins) => ins.department_id === selectedDepartmentId);
	const selectedInstructor = instructors.find(
		(i) => i.id === selectInstructorId
	);
	useEffect(() => {
		if (student) {
			form.reset({
				student_id: student.student_id,
				program: student.program_id,
				section: student.section,
				name: student.name,
				role: student.role_id,
				mobile_num: student.mobile_num,
				semester: student.semester,
				instructor: student.instructor_id,
				year_Level: student.year_level,
				facebook_profile: student.facebook_profile,
				selectedDepartmentId: student.department_id,
			});
			setSelectInstructorId(student.instructor_id);
		}
	}, [form, student]);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="text-white max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Student: {student.student_id}</DialogTitle>
					<DialogDescription>
						Update the student details below.
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
							name="instructor"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Instructor</FieldLabel>
										<Popover
											open={instructorOpen}
											onOpenChange={setInstructorOpen}
										>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={instructorOpen}
													disabled={selectedDepartmentId === 0 ? true : false}
													className={cn(
														'w-full justify-between',
														field.state.value === 0
															? 'text-muted-foreground'
															: 'text-white'
													)}
												>
													{selectedInstructor
														? selectedInstructor.name
														: 'Search and select instructor'}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-[400px] p-0" align="start">
												<Command>
													<CommandInput placeholder="Search adviser...." />
													<CommandList>
														<CommandEmpty>No instructor found.</CommandEmpty>
														<CommandGroup>
															{filteredInstructor.map((adv) => (
																<CommandItem
																	key={adv.id}
																	value={`${adv.name} ${String(adv.id)}`}
																	onSelect={() => {
																		field.setValue(adv.id);
																		setSelectInstructorId(adv.id);
																		setInstructorOpen(false);
																	}}
																	className={cn(
																		'',
																		selectInstructorId === adv.id
																			? 'bg-blue-600! text-white hover:bg-blue-600!'
																			: 'hover:bg-card/50'
																	)}
																>
																	<Check
																		className={cn(
																			'h-4 w-4',
																			Number(field.state.value) === adv.id
																				? 'opacity-100 text-white'
																				: 'opacity-0'
																		)}
																	/>
																	{adv.name}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
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
												value={field.state.value ?? ''}
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
												value={field.state.value ? field.state.value : ''}
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
							{loading ? '' : <Plus />}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default StudentEdit;
