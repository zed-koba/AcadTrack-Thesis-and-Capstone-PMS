import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { DocumentRevisionProps } from '../interface/document';
import React, { useState } from 'react';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldLabel } from '@/components/ui/field';

import { toast } from 'sonner';
import { AlertCircle, FileText, FileUp, Upload, X } from 'lucide-react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { apiStudentUrl } from '@/components/Routes/http';
import { Badge } from '@/components/ui/badge';

const uploadSchema = z.object({});

const DocumentRevisionDialog = ({
	document,
	refresh,
}: DocumentRevisionProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	type formValues = z.infer<typeof uploadSchema>;
	const defaultValues: formValues = {};

	const form = useForm({
		defaultValues,
		validators: {
			onChange: uploadSchema,
			onSubmit: uploadSchema,
		},

		onSubmit: async () => {
			if (!selectedFile) {
				toast.error('Please select a PDF File');
				return;
			}

			setLoading(true);
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append(
				'title_name',
				document?.title_name + '_v' + (document?.version + 1),
			);
			formData.append('description', document?.description ?? '');
			formData.append('parent_document_id', String(document.id));
			formData.append('chapter', String(document?.chapter));
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
					<Button variant="primary" className="bg-red-500 hover:bg-red-500/80">
						<FileUp className="h-4 w-4 mr-2" />
						Submit Revision
					</Button>
				</DialogTrigger>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>Submit Revision</DialogTitle>
						<DialogDescription>Upload a revised version for</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<div className="flex flex-col gap-5">
								<div className="p-4 rounded-lg bg-muted/30 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											{document.title_name}
										</span>
										<Badge
											variant="outline"
											className="bg-red-500/20 border-red-500/40 text-red-500"
										>
											<AlertCircle className="h-3 w-3 mr-1" />
											Needs Revision
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground">
										Current version: v{document.version} • New version will be:
										v{document.version + 1}
									</p>
								</div>
								<Field>
									<FieldLabel>Revised PDF File *</FieldLabel>
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

export default DocumentRevisionDialog;
