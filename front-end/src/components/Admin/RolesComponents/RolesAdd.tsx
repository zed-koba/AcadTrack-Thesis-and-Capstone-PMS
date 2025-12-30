import { apiUrl } from '@/components/Routes/http';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import type { RolesAddProps } from '../interface/roles';

const roleSchema = z
	.object({
		name: z.string().min(2, 'Department is required').max(100),
		globalRole: z.boolean(),
		description: z.string().max(500).optional(),
		selectedDepartmentsId: z.number(),
		status: z.enum(['active', 'inactive']),
	})
	.refine((data) => data.globalRole || data.selectedDepartmentsId > 0, {
		message: 'Select one department or make the role global',
		path: ['selectedDepartmentsId'],
	});

const RolesAdd = ({ departments, onSuccess }: RolesAddProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [globalRole, setGlobalRole] = useState(false);
	type formValues = z.infer<typeof roleSchema>;
	const defaultValues: formValues = {
		name: '',
		globalRole: true,
		selectedDepartmentsId: 0,
		description: '',
		status: 'active',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: roleSchema,
			onSubmit: roleSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			const payLoad = {
				name: value.name,
				globalRole: value.globalRole ? 1 : 0,
				assigned: 0,
				department_id:
					value.globalRole === true ? null : value.selectedDepartmentsId,
				description: value.description,
				status: value.status,
			};
			try {
				const res = await fetch(`${apiUrl}/roles/add`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payLoad),
				});

				const result = await res.json();
				if (result.status == 422) {
					const errors = result.errors as Record<string, string[]>;
					Object.values(errors).forEach((errorMessages) =>
						errorMessages.forEach((message) => {
							toast.error(message);
						})
					);
					console.log(payLoad);
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

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="primary">
						<Plus />
						Add Role
					</Button>
				</DialogTrigger>
				<DialogContent className="text-white sm:max-w-[500px]">
					<DialogHeader className="gap-0!">
						<DialogTitle className="font-medium text-lg">
							Add New Role
						</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Create a new role for capstone and thesis groups.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="grid grid-row-5 grid-cols-1 min-w-0 gap-4 mt-2">
							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Role Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder={'Ex. System Analyst'}
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
								name="description"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid} orientation="responsive">
											<FieldLabel htmlFor={field.name}>
												Description (Optional)
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder={
													'Describe the responsibilities of this role...'
												}
												autoComplete="off"
												className="resize-none overflow-hidden whitespace-pre-wrap 
												w-full wrap-break-words"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							<form.Field
								name="globalRole"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									setGlobalRole(field.state.value);
									return (
										<Field data-invalid={isInvalid} orientation="responsive">
											<Label className="flex flex-row items-start space-y-0 rounded-md border p-4">
												<Checkbox
													id={field.name}
													checked={field.state.value}
													onCheckedChange={(v) => field.handleChange(!!v)}
												/>
												<div className="grid gap-1.5 font-normal">
													<Label
														htmlFor={field.name}
														className="leading-none font-medium"
													>
														Global Role
													</Label>
													<Label
														className="text-sm text-muted-foreground font-normal"
														htmlFor={field.name}
													>
														This role will be available across all departments
													</Label>
												</div>
											</Label>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
							{!globalRole && (
								<form.Field
									name="selectedDepartmentsId"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid} orientation="responsive">
												<FieldLabel htmlFor={field.name}>
													Applicable Departments
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
														<SelectValue placeholder="Select Department" />
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
							)}
							<form.Field
								name="status"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} orientation="responsive">
											<FieldLabel htmlFor={field.name}>Status</FieldLabel>
											<Select
												name={field.name}
												defaultValue={field.state.value}
												onValueChange={(v) =>
													field.setValue(v as 'active' | 'inactive')
												}
											>
												<SelectTrigger
													className="w-auto"
													aria-invalid={isInvalid}
													id={field.name}
												>
													<SelectValue placeholder="Select Status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="active">Active</SelectItem>
													<SelectItem value="inactive">Inactive</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
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
									{loading ? 'Adding...' : 'Add Role'}
									{loading ? '' : <Plus />}
								</Button>
							</div>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default RolesAdd;
