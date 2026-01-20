import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { FileText, MessageSquare, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';
import {
	chapterStatusIcon,
	formatDate,
	formatDateWithTime,
	statusColor,
} from '@/components/functions/functions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import type { ViewDetailsProps } from '@/components/Adviser/interface/adviserdocument';
import { Badge } from '@/components/ui/badge';
import DocumentRevisionDialog from './DocumentRevisionDialog';

const DocumentViewDialog = ({
	document,
	selectedDocumentId,
	projectAdviser,
	open,
	setOpen,
	refresh,
	checkIfLatestVersion,
}: ViewDetailsProps) => {
	const [activeTab, setActiveTab] = useState('comments');
	const [revisionOpen, setRevisionOpen] = useState(false);
	const [submitRevision, setSubmitRevision] = useState(false);
	if (!document) return null;
	const handleSetSubmit = (submitRevision: boolean) => {
		setSubmitRevision(submitRevision);

		if (!submitRevision) setOpen(false);
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
										Version {document.version}| Last Updated:{' '}
										{formatDate(document.updated_at)}
									</p>
								</div>
							</div>
							<Badge
								variant="outline"
								className={cn(
									'bg-primary/10 text-primary border-primary/20 capitalize',
									statusColor[document.status],
								)}
							>
								{chapterStatusIcon[document.status]}
								{document.status}
							</Badge>
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
									value="comments"
									className="h-12 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
								>
									Comments
								</TabsTrigger>
							</TabsList>
						</div>
						<ScrollArea className="h-[calc(80vh-180px)]">
							<TabsContent value="comments" className="p-6 m-0 space-y-6">
								{document.comments.length === 0 ? (
									<div className="text-center py-8">
										<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
										<p className="text-sm text-muted-foreground">
											No comments yet
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{document.comments
											.slice()
											.reverse()
											.map((com) => (
												<div className="p-4 rounded-lg border border-border bg-muted/30">
													<div className="flex items-start justify-between mb-2">
														<div className="flex items-center gap-2">
															<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
																<User className="h-4 w-4 text-primary" />
															</div>
															<div>
																<p className="text-sm font-medium">
																	{projectAdviser?.name}
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
																statusColor[com.comment_type],
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
							</TabsContent>
						</ScrollArea>
					</Tabs>

					<Separator className="my-1" />

					<div className="flex justify-end gap-2 p-3">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
						{document.status === 'need revision' && checkIfLatestVersion && (
							<DocumentRevisionDialog
								document={document}
								refresh={refresh}
								open={revisionOpen}
								setOpen={setRevisionOpen}
								setSubmitRevision={handleSetSubmit}
							/>
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
