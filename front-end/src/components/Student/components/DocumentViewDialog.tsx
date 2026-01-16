import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { DocumentViewDialogProps } from '../interface/document';
import {
	FileText,
	MessageSquare,
	History,
	Download,
	FileCheck,
	Calendar,
	User,
	Clock,
	AlertCircle,
	Upload,
	FileWarning,
	X,
	Hash,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	downloadDocument,
	formatDate,
	formatDateWithTime,
	formatFileSize,
} from '@/components/functions/functions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiAdviserUrl, apiStudentUrl } from '@/components/Routes/http';
import type {
	DocumentCommentsProps,
	ViewDetailsProps,
} from '@/components/Adviser/interface/adviserdocument';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';


const DocumentViewDialog = ({
	documents,
	selectedDocumentId,
	open,
	setOpen,
	refresh,
}: ViewDetailsProps) => {
	const [activeTab, setActiveTab] = useState('overview');
	const document = useMemo(() => {
		return documents.find((d) => d.id === selectedDocumentId);
	}, [documents, selectedDocumentId]);
	const [comments, setComments] = useState<DocumentCommentsProps[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const versions = useMemo(() => {
		const childVersions = documents
			.filter(d => d.parent_document_id === selectedDocumentId)
			.sort((a, b) => b.version - a.version);

		const allVersions = document
			? [document, ...childVersions]
			: childVersions;

		return allVersions.sort((a, b) => b.version - a.version);
	}, [documents, selectedDocumentId, document]);
	const [loading, setLoading] = useState(false);
	const [uploadLoading, setuploadLoading] = useState(false);
	const isDisabled: boolean = loading || Boolean(!selectedFile);
	console.log(versions);
	const fetchComments = async () => {
		setLoading(true);
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
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchComments();
	}, []);
	const uploadRevision = async () => {
		if (!selectedFile) {
			toast.error('Please select a PDF File');
			return;
		}

		setuploadLoading(true);
		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append(
			'title_name',
			versions.length === 0
				? document?.title_name +
				'Revision' +
				' v' +
				((document?.version as number) + 1)
				: document?.title_name +
				'Revision' +
				' v' +
				((versions[0].version as number) + 1)
		);
		formData.append('description', document?.description ?? '');
		formData.append(
			'parent_document_id',
			versions.length === 1 ? String(versions[0].id) : String(versions[0].parent_document_id)
		);
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
					})
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
			setuploadLoading(false);
		}
	};
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	if (!document) return null;
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
	const canUploadRevision =
		(versions[0].status === 'need revision' && versions.length === 1) ||
		(versions.length > 1 && versions[0].status === 'need revision');
	console.log(canUploadRevision, versions[0].status === 'need revision');
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
	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};
	const removeFile = () => {
		setSelectedFile(null);
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
										Version {versions.length === 0 ? '1' : versions[0].version}{' '}
										| Last Updated:{' '}
										{versions.length === 0
											? formatDate(document?.updated_at as string)
											: formatDate(versions[0].updated_at as string)}
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
									value="comments"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
									onClick={() => fetchComments()}
								>
									Comments
								</TabsTrigger>
								<TabsTrigger
									value="history"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
								>
									Submission History
								</TabsTrigger>
							</TabsList>
						</div>
						<ScrollArea className="h-[calc(80vh-180px)]">
							<TabsContent value="overview" className="p-6 space-y-6 m-0">
								{canUploadRevision && (
									<Card className="bg-red-500/20 border border-red-500/40 text-red-500">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 font-medium text-sm">
												<FileWarning className="h-4 w-4" /> Action Required:
												Revision Needed
											</CardTitle>
											<CardDescription className="text-white pl-6">
												This document has been reviewed and requires revisions.
												Please address the comments and resubmit.
											</CardDescription>
										</CardHeader>
									</Card>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base flex items-center gap-2">
												<FileCheck className="h-4 w-4 text-primary" />
												Document Info
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 gap-4">
												<div className="flex items-center justify-between">
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Current Version
													</p>
													<p className="text-sm font-medium mt-1">
														v{versions.length === 0 ? '1' : versions[0].version}
													</p>
												</div>
												<div className="flex items-center justify-between">
													<p className="text-xs text-muted-foreground uppercase tracking-wide">
														Total Revisions
													</p>
													<p className="text-sm font-medium mt-1">
														{versions.length} revision(s)
													</p>
												</div>
												<div className="flex items-center justify-between">
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
								{canUploadRevision && (
									<Card className="border-2 bg-muted/50 border-dashed rounded-lg transition-colors">
										<CardContent className="flex items-center justify-between">
											{selectedFile ? (
												<>
													<div className="flex items-center gap-2">
														<FileText className="h-5 w-5 text-primary" />
														<span className="text-sm font-medium truncate max-w-[300px]">
															{selectedFile.name}
														</span>
													</div>
													<Button
														variant="ghost"
														size="icon"
														onClick={removeFile}
													>
														<X className="h-4 w-4" />
													</Button>
												</>
											) : (
												<>
													<label htmlFor="file-upload">
														<Button
															type="button"
															className="bg-red-500/90 shadow-sm hover:bg-red-500/80"
															onClick={handleButtonClick}
														>
															<Upload className="h-4 w-4 mr-2" /> Upload
															Document
														</Button>
														<input
															ref={fileInputRef}
															id="file-upload"
															type="file"
															accept=".pdf"
															className="hidden"
															onChange={handleFileChange}
														/>
													</label>
													<p className="text-sm text-muted-foreground font-regular">
														Click Upload Revision to select and upload your
														revised document.
													</p>
												</>
											)}
										</CardContent>
									</Card>
								)}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<AlertCircle className="h-4 w-4 text-primary" />
											Activity Summary
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
											<div className="text-center p-4 rounded-lg bg-muted/50">
												<p className="text-2xl font-bold text-primary">
													{versions.length}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Versions Submitted
												</p>
											</div>
											<div className="text-center p-4 rounded-lg bg-muted/50">
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
							<TabsContent value="comments" className="p-6 m-0 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="text-base">Comments </CardTitle>
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
						</ScrollArea>
					</Tabs>

					<Separator className="my-1" />

					<div className="flex justify-end gap-2 p-3">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
						{canUploadRevision && (
							<Button
								onClick={uploadRevision}
								disabled={isDisabled}
								variant="edit"
							>
								{uploadLoading ? (
									<>
										<Spinner className="h-4 w-4 mr-2 animate-spin" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="h-4 w-4 mr-2" />
										Upload Revision
									</>
								)}
							</Button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
		// <>
		// 	<Dialog open={open} onOpenChange={setOpen}>
		// 		<DialogContent className="text-white sm:max-w-[700px] max-h-[85vh]">
		// 			<DialogHeader>
		// 				<div className="flex items-center gap-3">
		// 					<div className="p-3 rounded-lg bg-primary/10">
		// 						<FileText className="h-5 w-5 text-primary" />
		// 					</div>
		// 					<div>
		// 						<DialogTitle>{document.title_name}</DialogTitle>
		// 						<p className="text-sm text-muted-foreground">
		// 							Version 1 | Last Updated {formatDate(document.updated_at)}
		// 						</p>
		// 					</div>
		// 				</div>
		// 			</DialogHeader>
		// 			<Tabs defaultValue="comments" className="mt-4">
		// 				<TabsList className="grid w-full grid-cols-2">
		// 					<TabsTrigger value="comments" className="gap-2">
		// 						<MessageSquare className="h-4 w-4" />
		// 						Comments (1)
		// 					</TabsTrigger>
		// 					<TabsTrigger value="versions" className="gap-2">
		// 						<History className="h-4 w-4" />
		// 						Versions (2)
		// 					</TabsTrigger>
		// 				</TabsList>
		// 				<ScrollArea className="h-[400px] mt-4">
		// 					<TabsContent value="comments" className="space-y-4 m-0">
		// 						{document.comments.map((com) => (
		// 							<Card>
		// 								<CardHeader>
		// 									<div className="flex items-center justify-between">
		// 										<div className="flex items-center gap-2">
		// 											<span className="font-medium text-sm">
		// 												Romnick Reyes
		// 											</span>
		// 											<div
		// 												className={cn(
		// 													'py-0.5 px-3 flex gap-1 items-center text-primary bg-primary/20  rounded-full',
		// 													com.comment_type === 'approval'
		// 														? commentsColorType.approval
		// 														: com.comment_type === 'need revision'
		// 														? commentsColorType['revision-request']
		// 														: commentsColorType.general
		// 												)}
		// 											>
		// 												<p className="text-xs font-medium capitalize">
		// 													{com.comment_type}
		// 												</p>
		// 											</div>
		// 										</div>
		// 										<span className="text-xs text-muted-foreground">
		// 											{formatDateWithTime(document.created_at)}
		// 										</span>
		// 									</div>
		// 								</CardHeader>
		// 								<CardContent>
		// 									<p className="text-sm">{com.comment}</p>
		// 								</CardContent>
		// 							</Card>
		// 						))}
		// 					</TabsContent>
		// 				</ScrollArea>
		// 			</Tabs>
		// 			<Separator className="my-1" />

		// 			<div className="flex justify-end gap-2">
		// 				<Button variant="outline" onClick={() => setOpen(false)}>
		// 					Close
		// 				</Button>
		// 				<Button
		// 					onClick={() => {
		// 						downloadDocument(document.id, document.original_name);
		// 					}}
		// 				>
		// 					<Download className="h-4 w-4 mr-2" />
		// 					Download Latest
		// 				</Button>
		// 			</div>
		// 		</DialogContent>
		// 	</Dialog>
		// </>
	);
};

export default DocumentViewDialog;
