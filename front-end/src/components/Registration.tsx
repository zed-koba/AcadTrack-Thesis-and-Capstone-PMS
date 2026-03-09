import { useState } from 'react';
import { api } from '../Routes/http';
import { toast, Toaster } from 'sonner';
import { GraduationCap, EyeOff, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';

import { Input } from './ui/input';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldLabel } from './ui/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
const registrationSchema = z.object({
	first_name: z.string('First name is required'),
	last_name: z.string('Last name is required'),
	email: z.email('Invalid email address'),
	role: z.enum(['student', 'adviser', 'instructor'], {
		message: 'Role is required',
	}),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	section: z.string('Section is required'),
	student_id: z.string('Student ID is required'),
});

const Registration = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState<'student' | 'adviser' | 'instructor'>(
		'student',
	);

	type formValues = z.infer<typeof registrationSchema>;
	const defaultValues: formValues = {
		first_name: '',
		last_name: '',
		email: '',
		role: 'student',
		password: '',
		section: '',
		student_id: '',
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: registrationSchema,
			onSubmit: registrationSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				email: value.email,
				password: value.password,
				name: `${value.first_name} ${value.last_name}`,
				role: value.role,
				section: value.role === 'student' ? value.section : undefined,
				student_id: value.role === 'student' ? value.student_id : undefined,
			};
			try {
				const res = await fetch(`${api}/accounts/add`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
					},
					body: JSON.stringify(payLoad),
				});
				const result = await res.json();
				if (result.status == 422) {
					const errors = result.errors as Record<string, string[]>;
					Object.values(errors).forEach((fieldMessages) =>
						fieldMessages.forEach((msg) => toast.error(msg)),
					);
				}
				if (result.status == 200) {
					toast.success(result.message);
					form.reset();
				}
			} catch (error) {
				toast.error('Registration failed. Please try again.');
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
			<Toaster position="top-center" />
			<div className="w-full max-w-md">
				{/* Logo */}
				<Link to="/" className="flex items-center justify-center gap-2 mb-8">
					<GraduationCap className="h-8 w-8 text-primary" />
					<span className="text-2xl font-bold text-foreground">AcadTrack</span>
				</Link>

				<Card className="border-border/50">
					<CardHeader className="text-center pb-4">
						<CardTitle className="text-2xl">Create Account</CardTitle>
						<CardDescription>
							Register to access your designated portal
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="space-y-4"
						>
							<form.Field
								name="role"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} className="space-y-2">
											<FieldLabel className="mb-0" htmlFor={field.name}>
												Register as
											</FieldLabel>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(v) => {
													field.handleChange(
														v as 'student' | 'adviser' | 'instructor',
													);
													setRole(v as 'student' | 'adviser' | 'instructor');
												}}
											>
												<SelectTrigger
													className="w-auto"
													aria-invalid={isInvalid}
													id={field.name}
												>
													<SelectValue placeholder="Select your role" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="student">Student</SelectItem>
													<SelectItem value="adviser">Adviser</SelectItem>
													<SelectItem value="instructor">Instructor</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<div className="grid grid-cols-2 gap-3">
								<form.Field
									name="first_name"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid} className="space-y-2">
												<FieldLabel className="mb-0" htmlFor={field.name}>
													First Name
												</FieldLabel>
												<Input
													id={field.name}
													placeholder="Juan"
													value={field.state.value}
													onBlur={field.handleBlur}
													aria-invalid={isInvalid}
													onChange={(e) => field.handleChange(e.target.value)}
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
											<Field data-invalid={isInvalid} className="space-y-2">
												<FieldLabel className="mb-0" htmlFor={field.name}>
													Last Name
												</FieldLabel>
												<Input
													id={field.name}
													placeholder="Dela Cruz"
													value={field.state.value}
													onBlur={field.handleBlur}
													aria-invalid={isInvalid}
													onChange={(e) => field.handleChange(e.target.value)}
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
								name="email"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field
											data-invalid={isInvalid}
											className="space-y-2 col-span-2"
										>
											<FieldLabel className="mb-0" htmlFor={field.name}>
												Email:{' '}
											</FieldLabel>
											<Input
												id={field.name}
												placeholder="juan_delacruz@gmail.com"
												value={field.state.value}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												onChange={(e) => field.handleChange(e.target.value)}
												type="email"
												autoComplete="email"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} className="space-y-2">
											<FieldLabel className="mb-0" htmlFor={field.name}>
												Password
											</FieldLabel>
											<div className="relative">
												<Input
													id="password"
													type={showPassword ? 'text' : 'password'}
													placeholder="••••••••"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="new-password"
													aria-invalid={isInvalid}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							{role === 'student' && (
								<div className="grid grid-cols-2 gap-3">
									<form.Field
										name="student_id"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid} className="space-y-2">
													<FieldLabel className="mb-0" htmlFor={field.name}>
														Student ID
													</FieldLabel>
													<Input
														id={field.name}
														placeholder="2#-########"
														value={field.state.value}
														onBlur={field.handleBlur}
														aria-invalid={isInvalid}
														onChange={(e) => field.handleChange(e.target.value)}
													/>
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
												<Field data-invalid={isInvalid} className="space-y-2">
													<FieldLabel className="mb-0" htmlFor={field.name}>
														Section
													</FieldLabel>
													<Input
														id={field.name}
														placeholder="CpE301"
														value={field.state.value}
														onBlur={field.handleBlur}
														aria-invalid={isInvalid}
														onChange={(e) => field.handleChange(e.target.value)}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</div>
							)}

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? 'Creating account...' : 'Create Account'}
							</Button>
						</form>
						<p className="text-center text-sm text-muted-foreground mt-6">
							Already have an account?{' '}
							<Link
								to="/Login"
								className="text-primary hover:underline font-medium"
							>
								Sign in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Registration;
