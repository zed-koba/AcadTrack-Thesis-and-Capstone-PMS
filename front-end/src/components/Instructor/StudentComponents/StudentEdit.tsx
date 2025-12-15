import { useState } from 'react';
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
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Spinner } from '@/components/ui/spinner';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import type { StudentEditProps } from '../interface/student';

const accountSchema = z.object({
	email: z.email('Invalid email address format').min(1, 'Email is required'),
	student_id: z.string().min(1, 'Student ID is required'),
	program: z.string().min(1, 'Program is required'),
	section: z.string().min(1, 'Section is required'),
});

const StudentEdit = ({
	open,
	setOpen,
	student,
	onSuccess,
}: StudentEditProps) => {
	const [loading, setLoading] = useState(false);
	type formValues = z.infer<typeof accountSchema>;
	const defaultValues: formValues = {
		email: student.email,
		student_id: student.student_id,
		program: student.program,
		section: student.section,
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: accountSchema,
			onSubmit: accountSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			console.log('SUBMIT');
			try {
				const res = await fetch(`${apiUrl}/accounts/edit/${student.id}`, {
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						student_id: value.student_id,
						email: value.email,
						program: value.program,
						section: value.section,
					}),
				});
				const result = await res.json();
				if (result.status === 422) {
					const errors = result.errors as Record<string, string[]>;
					Object.values(errors).forEach((errorMessages) =>
						errorMessages.forEach((message) =>
							toast.error(message, { theme: 'colored' })
						)
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
				setOpen(false);
				onSuccess?.();
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		},
	});
	<ToastContainer
		position="top-right"
		autoClose={5000}
		hideProgressBar={false}
		newestOnTop={true}
		closeOnClick={false}
		rtl={false}
		pauseOnFocusLoss={false}
		draggable
		pauseOnHover
		theme="dark"
		transition={Bounce}
	/>;
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
									name="email"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Email: </FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="email"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="Ex. example@gmail.com"
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
							<div className="grid grid-cols-3 gap-4">
								<div className="col-span-2">
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
								</div>
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
