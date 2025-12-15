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
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Spinner } from '@/components/ui/spinner';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';

const accountSchema = z.object({
	email: z.email('Invalid email address format').min(1, 'Email is required'),
	student_id: z.string().min(1, 'Student ID is required'),
	program: z.string().min(1, 'Program is required'),
	section: z.string().min(1, 'Section is required'),
});
type Props = {
	onSuccess?: () => void;
};
const StudentAdd = ({ onSuccess }: Props) => {
	const [open, setOpen] = useState(false);
	//const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	type formValues = z.infer<typeof accountSchema>;
	const defaultValues: formValues = {
		email: '',
		student_id: '',
		program: '',
		section: '',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: accountSchema,
			onSubmit: accountSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				student_id: value.student_id,
				email: value.email,
				program: value.program,
				section: value.section,
			};
			try {
				const res = await fetch(`${apiUrl}/accounts/add`, {
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
						errorMessages.forEach((message) =>
							toast.error(message, { theme: 'colored' })
						)
					);
					return;
				}
				if (!result.ok) {
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return JSON.stringify(payLoad);
				}
				form.reset();
				toast.success('Sucessfully added proponent');
				setOpen(false);
				onSuccess?.();
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
			/>
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
