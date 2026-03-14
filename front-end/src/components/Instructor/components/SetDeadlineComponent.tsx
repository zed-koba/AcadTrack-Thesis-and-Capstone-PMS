import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from '@tanstack/react-form';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';
import type { SetDealineComponentProps } from '../interface/deadlines';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { apiInstructorUrl } from '@/Routes/http';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { instructorId } from '@/components/functions/functions';
import { Checkbox } from '@/components/ui/checkbox';

const deadlineschema = z.object({
	document_title: z.string().min(1, 'Title is required'),
	deadline: z.date(),
	is_finalManuscript: z.boolean().optional(),
});
const SetDeadlineComponent = ({
	deadline,
	refresh,
	dialogOpen,
	setDialogOpen,
}: SetDealineComponentProps) => {
	const [loading, setLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		deadline ? new Date(deadline.deadline) : undefined,
	);
	type formValues = z.infer<typeof deadlineschema>;
	const defaultValues: formValues = {
		document_title: deadline?.document_title || '',
		deadline: deadline ? new Date(deadline.deadline) : new Date(),
		is_finalManuscript: deadline?.is_finalManuscript === 1 ? true : false,
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: deadlineschema,
			onSubmit: deadlineschema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				instructor_id: instructorId,
				document_title: value.document_title,
				deadline: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
				is_finalManuscript: value.is_finalManuscript ? 1 : 0,
			};

			if (!selectedDate) {
				toast.error('Please select a deadline date');
				setLoading(false);
				return;
			}
			try {
				const url = deadline
					? `${apiInstructorUrl}/deadlines/update/${deadline.id}`
					: `${apiInstructorUrl}/deadlines/add`;
				const res = await fetch(url, {
					method: deadline ? 'PUT' : 'POST',
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
						}),
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
				if (result.status == 201 || result.status == 200) {
					toast.success(result.message);
					setDialogOpen(false);
					refresh?.();
				}
			} catch (error) {
				console.log(error);
				console.log(payLoad);
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{deadline ? 'Edit Deadline' : 'Create New Deadline'}
						</DialogTitle>
						<DialogDescription>
							Set a deadline for document submission
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<form.Field
									name="document_title"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<>
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor="document_title">
														Document Title *
													</FieldLabel>

													<Input
														id="title"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														placeholder="e.g., Review Related of System"
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											</>
										);
									}}
								/>
							</div>
							<div className="space-y-2">
								<form.Field
									name="is_finalManuscript"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<>
												<FieldGroup className="w-full">
													<FieldLabel>
														<Field orientation="horizontal">
															<Checkbox
																id="toggle-checkbox-2"
																name="toggle-checkbox-2"
																checked={field.state.value}
																onCheckedChange={(v) =>
																	field.handleChange(v as boolean)
																}
															/>
															<FieldContent>
																<FieldTitle>Final Manuscript</FieldTitle>
																<FieldDescription>
																	Mark this as the final manuscript for the
																	deadline.
																</FieldDescription>
															</FieldContent>
														</Field>
													</FieldLabel>
												</FieldGroup>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</>
										);
									}}
								/>
							</div>

							<div className="space-y-2">
								<form.Field
									name="deadline"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel
													htmlFor="deadline"
													className="flex flex-col gap-1 justify-start items-start"
												>
													Select a date *
													<span className="text-xs text-muted-foreground">
														Select a date for deadline for the document
														submission
													</span>
												</FieldLabel>
												<div className="flex justify-center flex-col items-center gap-4">
													<Calendar
														id="dueDate"
														mode="single"
														selected={selectedDate}
														disabled={(date) => {
															const checkDate = format(
																new Date(date),
																'yyyy-MM-dd',
															);

															const today = format(new Date(), 'yyyy-MM-dd');

															return checkDate < today;
														}}
														onSelect={setSelectedDate}
														className="rounded-md border border-border pointer-events-auto focus:outline-none focus:border-none"
													/>
													{selectedDate && (
														<div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center w-full">
															<p className="text-sm font-medium">
																Selected:{' '}
																<span className="text-primary">
																	{format(selectedDate, 'EEEE, MMMM d, yyyy')}
																</span>
															</p>
														</div>
													)}
												</div>
											</Field>
										);
									}}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								disabled={loading}
								variant={deadline ? 'edit' : 'primary'}
							>
								{deadline ? (
									<Edit className="h-4 w-4 mr-1" />
								) : (
									<Plus className="h-4 w-4 mr-1" />
								)}
								{deadline ? 'Update' : 'Set'} Deadline
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SetDeadlineComponent;
