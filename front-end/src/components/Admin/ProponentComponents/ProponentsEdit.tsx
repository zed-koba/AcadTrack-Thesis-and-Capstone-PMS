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
import { apiUrl } from '@/Routes/http';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import type { ProponentsEditProps } from '../interface/proponent';
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
import ProponentsAutoComplete from './ProponentsAutoComplete';

const proponentSchema = z.object({
	academic_yr: z.string().min(1, 'Title is required'),
	title: z.string().min(1, 'Title is required'),
	adviser: z.number().min(1, 'Adviser is required'),
	studentsId: z.array(z.number()).optional(),
});

const ProponentsEdit = ({
	proponent,
	students,
	roles,
	advisers,
	onSuccess,
	proponents,
	open,
	setOpen,
}: ProponentsEditProps) => {
	const [adviserOpen, setAdviserOpen] = useState(false);
	//const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectAdviserId, setSelectedAdviserId] = useState(
		proponent.adviser_id,
	);
	const [removedStudentsIds, setRemovedStudentsIds] = useState<number[]>([]);
	type formValues = z.infer<typeof proponentSchema>;
	const studentsIds: number[] | undefined = proponent.details
		.filter((d) => d.foreign_proponents_id === proponent.proponents_id)
		.map((d) => d.student_id)
		.filter((id): id is number => id !== undefined);
	const [updatedStudentsIds, setUpdatedStudentsIds] =
		useState<number[]>(studentsIds);
	const defaultValues: formValues = {
		academic_yr: proponent.academic_yr,
		title: proponent.title,
		adviser: proponent.adviser_id,
		studentsId: updatedStudentsIds,
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: proponentSchema,
			onSubmit: proponentSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				academic_yr: value.academic_yr,
				title: value.title,
				adviser_id: value.adviser,
				students_id: updatedStudentsIds,
				deleted_ids: removedStudentsIds,
			};
			try {
				const res = await fetch(`${apiUrl}/proponents/edit/${proponent.id}`, {
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
						errorMessages.forEach((message) => toast.error(message)),
					);
					return;
				}
				if (!res.ok) {
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return JSON.stringify(payLoad);
				}
				form.reset();
				if (result.status === 200) {
					toast.success(result.message);
					setOpen(false);
					onSuccess?.();
					setRemovedStudentsIds([]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	const handleSelectedIds = (student: number[]) => {
		setUpdatedStudentsIds(student);
	};
	const selectedAdviser = advisers.find((adv) => adv.id === selectAdviserId);
	useEffect(() => {
		if (proponent) {
			form.reset({
				academic_yr: proponent.academic_yr,
				title: proponent.title,
				adviser: proponent.adviser_id,
				studentsId: updatedStudentsIds,
			});

			setUpdatedStudentsIds(studentsIds);
			setSelectedAdviserId(proponent.adviser_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, proponent]);
	const acad_yr = ['A.Y 2024-2025', 'A.Y 2025-2026', 'A.Y 2026-2027'];
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="text-white">
				<DialogHeader>
					<DialogTitle>Edit Proponent</DialogTitle>
					<DialogDescription>
						Update the project and proponent details below.
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

						<form.Field
							name="academic_yr"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Academic Year</FieldLabel>
										<Select
											name={field.name}
											defaultValue={field.state.value}
											onValueChange={(v) => field.handleChange(v)}
										>
											<SelectTrigger
												id={field.name}
												className="w-auto"
												aria-invalid={isInvalid}
											>
												<SelectValue placeholder="Select academic year" />
											</SelectTrigger>
											<SelectContent>
												{acad_yr.map((acad) => (
													<SelectItem key={acad} value={acad}>
														{acad}
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
							name="adviser"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Adviser</FieldLabel>
										<Popover open={adviserOpen} onOpenChange={setAdviserOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={adviserOpen}
													aria-invalid={isInvalid}
													className={cn(
														'w-full justify-between',
														field.state.value === 0
															? 'text-muted-foreground'
															: 'text-white',
													)}
												>
													{selectedAdviser
														? selectedAdviser.name
														: 'Search and select adviser'}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-[400px] p-0" align="start">
												<Command>
													<CommandInput placeholder="Search adviser...." />
													<CommandList>
														<CommandEmpty>No adviser found.</CommandEmpty>
														<CommandGroup>
															{advisers.map((adv) => (
																<CommandItem
																	key={adv.id}
																	value={`${adv.name} ${String(adv.id)}`}
																	onSelect={() => {
																		field.setValue(adv.id);
																		setSelectedAdviserId(adv.id);
																		setAdviserOpen(false);
																	}}
																	className={cn(
																		'',
																		selectAdviserId === adv.id
																			? 'bg-blue-600! text-white hover:bg-blue-600!'
																			: 'hover:bg-card/50',
																	)}
																>
																	<Check
																		className={cn(
																			'h-4 w-4',
																			Number(field.state.value) === adv.id
																				? 'opacity-100 text-white'
																				: 'opacity-0',
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
						<div className="pt-2 flex flex-col gap-4">
							<form.Field
								name="studentsId"
								children={(field) => {
									const arrayErrors = field.state.meta.errors;
									return (
										<>
											<div className="flex flex-col gap-1">
												<FieldLabel htmlFor={field.name}>
													Proponents:{' '}
												</FieldLabel>
												<ProponentsAutoComplete
													roles={roles}
													students={students}
													proponents={proponents}
													selectedStudentsIds={updatedStudentsIds ?? []}
													onSelectionChange={handleSelectedIds}
													initialStudents={studentsIds}
													onRemovedIdsChange={setRemovedStudentsIds}
													placeholder="Search for students by name or ID..."
												/>
												{arrayErrors.length > 0 && (
													<p className="text-destructive text-md font-normal">
														{arrayErrors[0]?.message}
													</p>
												)}
											</div>
										</>
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
							onClick={() => {
								setOpen(false);
								form.reset();
								onSuccess?.();
							}}
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
							{loading ? 'Adding...' : 'Update'}
							{loading ? '' : <Plus />}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ProponentsEdit;
