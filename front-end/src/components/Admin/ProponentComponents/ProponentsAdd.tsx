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
import type { ProponentAddProps } from '../interface/proponent';
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
	semester: z.number().min(1, 'Must select a semester').max(2),
	program: z.number().min(1, 'Program is required'),
	adviser: z.number().min(1, 'Adviser is required'),
	studentsId: z.array(z.number()).optional(),
});

const ProponentsAdd = ({
	students,
	programs,
	advisers,
	roles,
	refresh,
}: ProponentAddProps) => {
	const [open, setOpen] = useState(false);
	const [adviserOpen, setAdviserOpen] = useState(false);
	//const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectAdviserId, setSelectedAdviserId] = useState(0);
	type formValues = z.infer<typeof proponentSchema>;

	const defaultValues: formValues = {
		academic_yr: '',
		title: '',
		semester: 0,
		adviser: 0,
		program: 0,
		studentsId: [],
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
				semester: value.semester,
				adviser_id: value.adviser,
				program_id: value.program,
				students_id: value.studentsId,
			};
			try {
				const res = await fetch(`${apiUrl}/proponents/add`, {
					method: 'POST',
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
					return;
				}
				if (!res.ok) {
					console.log('Failed to fetch data ' + JSON.stringify(payLoad));
					return JSON.stringify(payLoad);
				}
				form.reset();
				toast.success('Sucessfully added proponent');
				setOpen(false);
				refresh?.();
				console.log(payLoad);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	const selectedAdviser = advisers.find((adv) => adv.id === selectAdviserId);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="text-white cursor-pointer" variant="primary">
					Add Proponent <Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="text-white">
				<DialogHeader>
					<DialogTitle>Add Proponent</DialogTitle>
					<DialogDescription>
						Fill in the project information and proponents members.
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
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
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
						</div>
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
													className={cn(
														'w-full justify-between',
														field.state.value === 0
															? 'text-muted-foreground'
															: 'text-white'
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
						<div className="grid grid-cols-3 gap-2">
							<div className="col-span-3">
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
												>
													<SelectTrigger
														className="w-auto"
														aria-invalid={isInvalid}
														id={field.name}
													>
														<SelectValue placeholder="Select a program" />
													</SelectTrigger>
													<SelectContent>
														{programs.map((prog) => (
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
							</div>
						</div>
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
													students={students}
													initialStudents={[]}
													selectedStudentsIds={field.state.value ?? []}
													onSelectionChange={field.handleChange}
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

export default ProponentsAdd;
