import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import {
	FileText,
	MessageSquare,
	History,
	Download,
	Clock,
	AlertCircle,
	Calendar,
	FileCheck,
	User,
	GraduationCap,
	Folder,
	Mail,
	Users,
	Send,
	Check,
	Hash,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	downloadDocument,
	formatDate,
	formatDateWithTime,
	formatFileSize,
} from '@/components/functions/functions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type {
	DocumentCommentsProps,
	ViewDetailsProps,
} from '../../interface/adviserdocument';
import { apiAdviserUrl } from '@/components/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';

const commentSchema = z.object({
	comment_type: z.enum(
		['general', 'need revision', 'approved'],
		'Select a comment type'
	),
	comment: z.string().min(2, 'Atleast enter 2 characters in the comment'),
});

const DocumentDetails = ({
	documents,
	selectedDocumentId,
	open,
	setOpen,
	refresh,
}: ViewDetailsProps) => {
	const [activeTab, setActiveTab] = useState('overview');
	const [comments, setComments] = useState<DocumentCommentsProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const document = useMemo(() => {
		return documents.find((d) => d.id === selectedDocumentId);
	}, [documents, selectedDocumentId]);

	const versions = useMemo(() => {
		const childVersions = documents
			.filter(d => d.parent_document_id === document?.id)
			.sort((a, b) => b.version - a.version);
		console.log(documents);
		const allVersions = document
			? [document, ...childVersions]
			: childVersions;

		return allVersions.sort((a, b) => b.version - a.version);
	}, [documents, selectedDocumentId, document]);

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
			setLoading(true);
			try {
				const payLoad = {
					document_id: document?.id,
					comment: value.comment,
					comment_type: value.comment_type,
				};
				const res = await fetch(`${apiAdviserUrl}/comments/add`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						Accepts: 'application/json',
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
					await refresh?.();
					await fetchComments();
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	useEffect(() => {
		fetchComments();
	}, []);
	if (!selectedDocumentId) return;

	const fetchComments = async () => {
		setSubmitLoading(true);
		try {
			const res = await fetch(`${apiAdviserUrl}/${document?.id}/comments`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accepts: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch comments');
			const result = await res.json();
			if (result.status === 200) {
				setComments(result.comments);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitLoading(false);
		}
	};
	const commentsColorType = {
		general: 'bg-primary/10 text-primary',
		'revision-request': 'bg-red-500/10 text-red-500',
		approval: 'bg-green-500/10 text-green-500',
	};

	const statusColor = {
		pending: 'bg-amber-500/20 border-amber-500/40 text-amber-500',
		'under review': 'bg-success/20 border-success/40 text-success',
		'need revision': 'bg-red-500/20 border-red500/40 text-red-500',
		'approved': 'bg-green-500/20 border-green-500/40 text-green-500',
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white  sm:max-w-4xl max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
					<DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30">
						<div className="flex items-center gap-4	justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-lg bg-primary/10">
									<FileText className="h-6 w-6 text-primary" />
								</div>
								<div>
									<DialogTitle>{document?.title_name}</DialogTitle>
									<p className="text-sm text-muted-foreground">
										Version 1 | Last Updated:{' '}
										{formatDate(document?.updated_at as string)}
									</p>
								</div>
							</div>
						</div>
					</DialogHeader>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1"
					>
						<div className="border-b border-border px-6">
							<TabsList className="h-12 bg-transparent p-0 gap-6">
								<TabsTrigger
									value="overview"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
								>
									Overview
								</TabsTrigger>
								<TabsTrigger
									value="student"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
								>
									Student & Project
								</TabsTrigger>
								<TabsTrigger
									value="history"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
								>
									Submission History
								</TabsTrigger>
								<TabsTrigger
									value="comments"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
									onClick={() => fetchComments()}
								>
									Comments
								</TabsTrigger>
							</TabsList>
						</div>
						<ScrollArea className="h-[calc(80vh-180px)]">
							<TabsContent value="overview" className="p-6 space-y-6 m-0">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base flex items-center gap-2">
												<FileCheck className="h-4 w-4 text-primary" />
												Document Overview
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Document Type
													</p>
													<p className="text-sm font-medium mt-1">PDF File</p>
												</div>
												<div>
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Current Version
													</p>
													<p className="text-sm font-medium mt-1">
														Version{' '}
														{versions.length === 0 ? '1' : versions[0].version}
													</p>
												</div>
												<div>
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Status
													</p>
													<div
														className={cn(
															'py-0.5 px-3 inline-flex gap-1 items-center rounded-full mt-1 border',
															document?.status === 'pending' &&
															statusColor.pending,
															document?.status === 'under review' &&
															statusColor['under review'],
															document?.status === 'need revision' &&
															statusColor['need revision'],
															document?.status === 'approved' &&
															statusColor.approved
														)}
													>
														<Clock className="h-3 w-3" />
														<p className="text-xs font-medium capitalize">
															{document?.status}
														</p>
													</div>
												</div>
												<div>
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Total Revisions
													</p>
													<p className="text-sm font-medium mt-1">
														{versions.length} revision(s)
													</p>
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Key Dates */}
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base flex items-center gap-2">
												<Calendar className="h-4 w-4 text-primary" />
												Key Dates
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-3">
												<div className="flex items-center justify-between py-2 border-b border-border">
													<span className="text-sm text-muted-foreground">
														Initial Submission
													</span>
													<span className="text-sm font-medium">
														{formatDate(document?.created_at as string)}
													</span>
												</div>
												<div className="flex items-center justify-between py-2 border-b border-border">
													<span className="text-sm text-muted-foreground">
														Last Updated
													</span>
													<span className="text-sm font-medium">
														{versions.length === 0
															? formatDate(document?.updated_at as string)
															: formatDate(versions[0].updated_at as string)}
													</span>
												</div>
												{versions.length !== 0 &&
													versions[0].status === 'approved' && (
														<div className="flex items-center justify-between py-2">
															<span className="text-sm text-muted-foreground">
																Approval Date
															</span>
															<span className="text-sm font-medium text-emerald-600">
																{formatDate(versions[0].updated_at)}
															</span>
														</div>
													)}
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<AlertCircle className="h-4 w-4 text-primary" />
											Activity Summary
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
											<div className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/30" onClick={() => setActiveTab('history')}>
												<p className="text-2xl font-bold text-primary">
													{versions.length}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Versions Submitted
												</p>
											</div>
											<div className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/30" onClick={() => setActiveTab('comments')}>
												<p className="text-2xl font-bold text-primary">
													{comments.length}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Comments
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="student" className="p-6 m-0 space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Student Information */}
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base flex items-center gap-2">
												<User className="h-4 w-4 text-primary" />
												Student Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="flex items-center gap-4">
												<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
													<User className="h-6 w-6 text-primary" />
												</div>
												<div>
													<p className="font-medium">
														{document?.student.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{document?.student.student_id}
													</p>
												</div>
											</div>
											<Separator />
											<div className="space-y-3">
												<div className="flex items-center gap-3">
													<GraduationCap className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">
														{document?.student.program.name}
													</span>
												</div>
												<div className="flex items-center gap-3">
													<Folder className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">
														{document?.student.department.name}
													</span>
												</div>
												<div className="flex items-center gap-3">
													<Mail className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">
														{document?.student.account.email}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base flex items-center gap-2">
												<Folder className="h-4 w-4 text-primary" />
												Project Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													Project Title
												</p>
												<p className="text-sm font-medium mt-1">
													{document?.student.proponent_detail === null
														? 'Not Assigned'
														: document?.student.proponent_detail.proponent
															.title}
												</p>
											</div>
											<div>
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													Project Type
												</p>
												<Badge variant="outline" className="mt-1">
													Capstone
												</Badge>
											</div>
											<Separator />
											<div className="space-y-2">
												<div className="flex justify-between">
													<span className="text-sm text-muted-foreground">
														Adviser
													</span>
													<span className="text-sm font-medium">
														Romnick Reyes
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-muted-foreground">
														Instructor
													</span>
													<span className="text-sm font-medium">
														{document?.student.instructor.name}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Group Members */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<Users className="h-4 w-4 text-primary" />
											Group Members
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											{/* {projectInfo.groupMembers.map((member, index) => ( */}
											<div
												// key={index}
												className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
											>
												<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
													<User className="h-5 w-5 text-primary" />
												</div>
												<div>
													<p className="text-sm font-medium">
														{document?.student.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{document?.student.role === null
															? 'Not Assigned'
															: document?.student.role.name}
													</p>
												</div>
											</div>
											{/* ))} */}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="history" className="p-6 m-0 space-y-6">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<History className="h-4 w-4 text-primary" />
											Version History
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="relative">
											<div className="absolute left-4 top-8 bottom-4 w-0.5 bg-border" />

											<div className="space-y-6">
												{versions
													.map((version, index) => (
														<div
															key={version.id}
															className="relative flex gap-4"
														>
															<div
																className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${index === 0
																	? 'bg-primary text-primary-foreground'
																	: 'bg-muted border-2 border-border'
																	}`}
															>
																{index === 0 ? (
																	<FileCheck className="h-4 w-4" />
																) : (
																	<Hash className="h-4 w-4 text-muted-foreground" />
																)}
															</div>

															{/* Content */}
															<div className="flex-1 pb-2">
																<div className="flex items-start justify-between">
																	<div>
																		<p className="font-medium text-sm">
																			Version
																			{version.version}
																			{index === 0 && (
																				<Badge
																					variant="outline"
																					className="ml-2 text-xs"
																				>
																					Current
																				</Badge>
																			)}
																		</p>
																		<p className="text-sm text-muted-foreground mt-0.5">
																			{version.original_name}
																		</p>
																	</div>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="shrink-0"
																		onClick={() =>
																			downloadDocument(
																				version.id,
																				version.original_name
																			)
																		}
																	>
																		<Download className="h-4 w-4 mr-1.5" />
																		Download
																	</Button>
																</div>
																<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
																	<span className="flex items-center gap-1">
																		<Calendar className="h-3.5 w-3.5" />
																		{/* {format(
																			version.uploadedAt,
																			"MMM d, yyyy 'at' h:mm a"
																		)} */}
																		{formatDate(version.created_at)}
																	</span>
																	<span className="flex items-center gap-1">
																		<FileText className="h-3.5 w-3.5" />
																		{formatFileSize(version.size)} MB
																	</span>
																</div>
															</div>
														</div>
													))}
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="comments" className="p-6 m-0 space-y-6">
								{/* Add Comment Section */}
								<Card>
									<CardHeader>
										<CardTitle className="text-base flex items-center gap-2">
											<MessageSquare className="h-4 w-4 text-primary" />
											Add Comment
										</CardTitle>
									</CardHeader>
									<CardContent>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												form.handleSubmit();
											}}
											className="flex flex-col gap-3"
										>
											<form.Field
												name="comment_type"
												children={(field) => {
													const isInvalid =
														field.state.meta.isTouched &&
														!field.state.meta.isValid;

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
																		v as
																		| 'general'
																		| 'need revision'
																		| 'approved'
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
																	<SelectItem value="general">
																		General
																	</SelectItem>
																	<SelectItem value="need revision">
																		Need Revision
																	</SelectItem>
																	<SelectItem value="approved">
																		Approval
																	</SelectItem>
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
														field.state.meta.isTouched &&
														!field.state.meta.isValid;

													return (
														<Field data-invalid={isInvalid}>
															<FieldLabel htmlFor={field.name}>
																Comment: *
															</FieldLabel>
															<Textarea
																placeholder="Enter your comment for documentation purposes..."
																onChange={(e) =>
																	field.handleChange(e.target.value)
																}
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
									</CardContent>
								</Card>

								{/* Existing Comments */}
								<Card>
									<CardHeader>
										<CardTitle className="text-base">Comment History</CardTitle>
									</CardHeader>
									<CardContent>
										{loading && (
											<div className="text-center flex justify-center items-center text-muted-foreground py-8">
												<Spinner className="h-8 w-8" />
											</div>
										)}
										{!loading && comments.length === 0 ? (
											<div className="text-center py-8">
												<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
												<p className="text-sm text-muted-foreground">
													No comments yet
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Add the first comment for documentation
												</p>
											</div>
										) : (
											<div className="space-y-4">
												{comments.map((com) => (
													<div className="p-4 rounded-lg border border-border bg-muted/30">
														<div className="flex items-start justify-between mb-2">
															<div className="flex items-center gap-2">
																<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
																	<User className="h-4 w-4 text-primary" />
																</div>
																<div>
																	<p className="text-sm font-medium">
																		Romnick Reyes
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{formatDateWithTime(com.created_at)}
																	</p>
																</div>
															</div>
															<Badge
																variant="outline"
																className={cn(
																	'bg-primary/10 text-primary border-primary/20 capitalize',
																	com.comment_type === 'approval'
																		? commentsColorType.approval
																		: com.comment_type === 'need revision'
																			? commentsColorType['revision-request']
																			: commentsColorType.general
																)}
															>
																{com.comment_type}
															</Badge>
														</div>
														<p className="text-sm pl-10">{com.comment}</p>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</ScrollArea>
					</Tabs>

					<Separator className="my-1" />

					<div className="flex justify-end gap-2 p-3">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
						<Button
							onClick={() =>
								downloadDocument(
									versions[0].id,
									versions[0].original_name as string
								)
							}
						>
							<Download className="h-4 w-4 mr-2" />
							Download Current PDF
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DocumentDetails;
