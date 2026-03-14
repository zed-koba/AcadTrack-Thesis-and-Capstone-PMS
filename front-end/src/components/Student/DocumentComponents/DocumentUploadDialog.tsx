import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { DocumentUploadProps } from '../interface/document';
import React, { useState } from 'react';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import { FileText, Upload, X } from 'lucide-react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { apiStudentUrl } from '@/Routes/http';

import { getInformation, getProjectId } from '@/components/functions/functions';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const uploadSchema = z.object({
	document_title: z.string().min(2, 'Title required'),
	description: z.string().nullable().optional(),
});

const DocumentUploadDialog = ({ refresh, deadlines }: DocumentUploadProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const information = getInformation();
	const projectId = getProjectId();
	type formValues = z.infer<typeof uploadSchema>;
	const defaultValues: formValues = {
		document_title: '',
		description: '',
	};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: uploadSchema,
			onSubmit: uploadSchema,
		},

		onSubmit: async ({ value }) => {
			if (!selectedFile) {
				toast.error('Please select a PDF File');
				return;
			}
			setLoading(true);

			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('student_id', information.id);
			formData.append('title_name', value.document_title);
			formData.append('project_id', projectId.proponents_id);

			try {
				const res = await fetch(`${apiStudentUrl}/documents/add`, {
					method: 'POST',
					body: formData,
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
					return;
				}
				if (!res.ok) {
					console.log(result.status);
					console.log('Failed to fetch data ' + JSON.stringify(formData));
					return;
				}
				if (result.status == 201) {
					form.reset();
					setSelectedFile(null);
					toast.success(result.message);
					setOpen(false);
					refresh?.();
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			if (file.type === 'application/pdf') {
				setSelectedFile(file);
			} else {
				toast.error('Invalid file type. Upload a PDF file');
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.type === 'application/pdf') {
				setSelectedFile(file);
			} else {
				toast.error('Invalid file type. Upload a PDF file');
			}
		}
	};

	const removeFile = () => {
		setSelectedFile(null);
	};
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="primary">
						<Upload className="h-4 w-4 mr-2" />
						Upload Document
					</Button>
				</DialogTrigger>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>Upload Document</DialogTitle>
						<DialogDescription>
							Upload a PDF document for adviser review and feedback
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<div className="flex flex-col gap-5">
								<form.Field
									name="document_title"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Document Title *
												</FieldLabel>

												<Select
													name={field.name}
													defaultValue={field.state.value}
													value={field.state.value}
													onValueChange={(v) => field.handleChange(v)}
												>
													<SelectTrigger
														className="w-full"
														aria-invalid={isInvalid}
														id={field.name}
													>
														<SelectValue
															placeholder={
																deadlines.length > 0
																	? 'Select a document'
																	: 'No deadline has been scheduled yet'
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{deadlines.map((deadline) => (
															<SelectItem value={deadline.document_title}>
																{deadline.document_title}
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

								<Field>
									<FieldLabel>PDF File *</FieldLabel>
									{selectedFile ? (
										<div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
											<div className="flex items-center gap-2">
												<FileText className="h-5 w-5 text-primary" />
												<span className="text-sm font-medium truncate max-w-[300px]">
													{selectedFile.name}
												</span>
											</div>
											<Button variant="ghost" size="icon" onClick={removeFile}>
												<X className="h-4 w-4" />
											</Button>
										</div>
									) : (
										<div
											className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
												dragActive
													? 'border-primary bg-primary/5'
													: 'border-muted-foreground/25'
											}`}
											onDragEnter={handleDrag}
											onDragLeave={handleDrag}
											onDragOver={handleDrag}
											onDrop={handleDrop}
										>
											<Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Drag and Drop your pdf file here, or
											</p>
											<label htmlFor="file-upload">
												<Button
													variant="outline"
													size="sm"
													className="mt-2"
													asChild
												>
													<span className="cursor-pointer">Browse Files</span>
												</Button>
												<input
													id="file-upload"
													type="file"
													accept=".pdf"
													className="hidden"
													onChange={handleFileChange}
												/>
											</label>
										</div>
									)}
								</Field>
								<div className="flex justify-end pt-3 gap-3">
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
										{loading ? 'Uploading...' : 'Upload Document'}
										{loading ? '' : <Upload />}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DocumentUploadDialog;
