import { apiAdviserUrl } from '@/Routes/http';
import type { DocumentProps } from '@/components/Student/interface/document';
import { information, userToken } from '@/components/functions/functions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { FileText, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
const commentSchema = z.object({
	comment_type: z.enum(
		['general', 'need revision', 'approved'],
		'Select a comment type',
	),
	comment: z.string().min(2, 'Atleast enter 2 characters in the comment'),
});
const CommentAddDialog = ({
	document,
	refresh,
}: {
	document: DocumentProps | null;
	refresh?: () => void;
}) => {
	const [open, setOpen] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	type formValues = z.infer<typeof commentSchema>;
	const defaultValues: formValues = {
		comment_type: 'general',
		comment: '',
	};
	const form = useForm({
		defaultValues,
		validators: {
			onChange: commentSchema,
			onSubmit: commentSchema,
		},
		onSubmit: async ({ value }) => {
			setSubmitLoading(true);
			try {
				const payLoad = {
					document_id: document?.id,
					comment: value.comment,
					comment_type: value.comment_type,
					adviser_id: information.id,
					foreign_proponents_id: document?.student.proponent_detail
						? document?.student.proponent_detail.foreign_proponents_id
						: document?.student.project.proponents_id,
					adviser_name: information.name,
					document_title: document?.title_name,
				};

				const res = await fetch(`${apiAdviserUrl}/comments/add`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						Accepts: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
					body: JSON.stringify(payLoad),
				});
				const result = await res.json();
				if (result.status === 422) {
					toast.error('Failed to add comment');
					console.log(payLoad);
					console.log(result.errors);
					return;
				}
				if (result.status === 500) {
					toast.error('Failed to add comment');
					console.log(result.error);
					return;
				}
				if (!res.ok) throw new Error('Failed to fetch comments');
				if (result.status === 201) {
					form.reset();
					toast.success(result.message);
					setOpen(false);
					await refresh?.();
				}
			} catch (error) {
				console.log(error);
			} finally {
				setSubmitLoading(false);
			}
		},
	});
	const statusRevised = document?.status === 'revised';
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="primary" size="sm" disabled={statusRevised}>
						{' '}
						<MessageSquare className="w-4 h-4" /> Add Comment{' '}
					</Button>
				</DialogTrigger>
				<DialogContent className="text-white sm:max-w-[680px]">
					<DialogHeader className="gap-0!">
						<DialogTitle className="font-medium text-lg flex items-center gap-2">
							<MessageSquare className="w-5 h-5" /> Quick Comment
						</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Send comment to student regarding their document.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4 bg-card/50 rounded-md flex items-center gap-4">
						<div className="p-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
							<FileText className="h-5 w-5" />
						</div>
						<div className="flex flex-col gap-0">
							<p className="font-bold text-sm text-white">
								{document?.title_name}{' '}
								<Badge
									variant="outline"
									className="text-xs font-normal py-0.5 px-2"
								>
									v{document?.version}
								</Badge>
							</p>
							<p className="text-xs text-muted-foreground">
								{document?.original_name}
							</p>
						</div>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="flex flex-col gap-3 min-w-0"
					>
						<form.Field
							name="comment_type"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Comment Type: *
										</FieldLabel>
										<Select
											name={field.name}
											defaultValue={field.state.value}
											value={field.state.value}
											onValueChange={(v) =>
												field.handleChange(
													v as 'general' | 'need revision' | 'approved',
												)
											}
										>
											<SelectTrigger
												className="w-60 max-w-60"
												aria-invalid={isInvalid}
											>
												<SelectValue placeholder="Select a comment type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">General</SelectItem>
												<SelectItem value="need revision">
													Need Revision
												</SelectItem>
												<SelectItem value="approved">Approval</SelectItem>
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
							name="comment"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Comment: *</FieldLabel>
										<Textarea
											placeholder="Enter your comment for documentation purposes..."
											onChange={(e) => field.handleChange(e.target.value)}
											className="min-h-[100px] resize-none"
											aria-invalid={isInvalid}
											onBlur={field.handleBlur}
											value={field.state.value}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						<div className="flex justify-end">
							<Button
								// onClick={handleAddComment}
								disabled={submitLoading}
							>
								{!submitLoading ? (
									<Send className="h-4 w-4 mr-1.5" />
								) : (
									<Spinner className="h-4 w-4 mr-1.5" />
								)}
								{!submitLoading ? 'Add Comment' : 'Commenting'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CommentAddDialog;
