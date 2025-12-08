import type {
	ProponentsEditProps,
	ProponentsDetailsProps,
} from '../interface/proponent';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRightToLine, UserCircle } from 'lucide-react';
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
import ProponentUpdate from './ProponentsUpdate';

const proponentDetailsSchema = z.object({
	name: z.string().optional(),
});

const proponentSchema = z.object({
	academic_yr: z.string().min(1, 'Title is required'),
	title: z.string().min(1, 'Title is required'),
	semester: z.number().min(1, 'Must select a semester').max(2),
	program: z.string().min(1, 'Program is required'),
	adviser: z.string().min(1, 'Adviser is required'),
	details: z.array(proponentDetailsSchema).min(1),
});

const ProponetsEdit = ({
	open,
	setOpen,
	proponent,
	onSuccess,
}: ProponentsEditProps) => {
	const [loading, setLoading] = useState(false);
	const [openProponent, setOpenPropent] = useState(false);
	const [proponentsDetails, setProponents] = useState<ProponentsDetailsProps[]>(
		proponent.details
	);
	const [selectedProponent, setSelectedProponent] =
		useState<ProponentsDetailsProps | null>(null);

	const handleRemove = (id: number) => {
		setProponents(proponentsDetails.filter((p) => p.propsdetails_id !== id));
	};
	useEffect(() => {
		setProponents(proponent.details);
	}, [proponent]);

	const handleNameUpdate = (updatedProponent: ProponentsDetailsProps) => {
		setProponents((prev) =>
			prev.map((p) =>
				p.propsdetails_id === updatedProponent.propsdetails_id
					? updatedProponent
					: p
			)
		);
		setSelectedProponent(null);
	};
	type formValues = z.infer<typeof proponentSchema>;
	const defaultValues: formValues = {
		academic_yr: proponent.academic_yr,
		title: proponent.title,
		semester: proponent.semester,
		program: proponent.program,
		adviser: proponent.adviser,
		details: proponent.details,
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: proponentSchema,
			onSubmit: proponentSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
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
						<DialogTitle>Edit Proponent: {proponent.proponents_id}</DialogTitle>
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
							<form.Field
								name="title"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Title</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Ex. Web Based Project Management System"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<div className="grid grid-cols-2 gap-2">
								<form.Field
									name="academic_yr"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Academic Year
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													placeholder="Ex. 2024-2025"
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
									name="semester"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Semester</FieldLabel>
												<Select
													name={field.name}
													value={
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
							</div>
							<div className="grid grid-cols-3 gap-2">
								<div className="col-span-2">
									<form.Field
										name="adviser"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Adviser</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														aria-invalid={isInvalid}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														autoComplete="off"
														placeholder="Ex. Jay De Sagun"
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
									name="program"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Program</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													aria-invalid={isInvalid}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="off"
													placeholder="Ex. BSCS"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>
							<div className="pt-2 flex flex-col gap-4">
								<h2 className="text-white text-lg">Proponents: </h2>
								<div className="pt-2 flex flex-col gap-4">
									{proponentsDetails.map((p) => (
										<div
											key={p.propsdetails_id}
											className="bg-card p-4 rounded-lg border-none flex justify-start items-center gap-3 text-base font-semibold text-white cursor-pointer hover:bg-gray-700"
											onClick={() => {
												setSelectedProponent(p);
												setOpenPropent(true);
											}}
										>
											<UserCircle /> {p.name}
										</div>
									))}
								</div>
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
				{selectedProponent && (
					<ProponentUpdate
						open={openProponent}
						proponent={selectedProponent}
						setOpen={setSelectedProponent}
						onUpdate={handleNameUpdate}
						onRemove={(id) =>
							setProponents((prev) =>
								prev.filter((p) => p.propsdetails_id !== id)
							)
						}
					/>
				)}
			</Dialog>
		</>
	);
};

export default ProponetsEdit;
