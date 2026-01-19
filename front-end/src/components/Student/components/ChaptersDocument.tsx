import {
	chapterStatusIcon,
	formatDate,
	getProjectStatus,
	statusColor,
} from '@/components/functions/functions';
import { cn } from '@/lib/utils';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ChapterItem from './ChapterItem';
import type { ChaptersProps } from '../interface/document';
import DocumentRevisionDialog from './DocumentRevisionDialog';

const ChaptersDocument = ({
	chapter,
	isExpanded,
	onToggle,
	projectAdviser,
	refresh,
}: ChaptersProps) => {
	const document =
		chapter.documents[0].versions.length === 0
			? chapter.documents[0]
			: chapter.documents[0].versions[0];
	return (
		<Collapsible open={isExpanded} onOpenChange={onToggle}>
			<div className="rounded-lg border border-border/50 bg-background overflow-hidden">
				<CollapsibleTrigger asChild>
					<div className="flex items-center justify-between">
						<button className="w-full flex items-center gap-3 p-3 transition-colors text-left cursor-pointer">
							<div className="flex items-center gap-2">
								{isExpanded ? (
									<ChevronDown className="h-3 w-3 text-muted-foreground cursor-pointer" />
								) : (
									<ChevronRight className="h-3 w-3 text-muted-foreground cursor-pointer" />
								)}
								{isExpanded ? (
									<FolderOpen className="h-4 w-4 text-primary cursor-pointer" />
								) : (
									<Folder className="h-4 w-4 text-muted-foreground cursor-pointer" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										Chapter {chapter.chapter}
									</span>
									<Badge
										variant="outline"
										className={cn(
											'text-xs capitalize',
											statusColor[document.status],
										)}
									>
										{chapterStatusIcon[document.status]}
										{document.status}
									</Badge>
								</div>
								<p className="text-xs text-muted-foreground mt-0.5">
									{chapter.documents.length} document
									{chapter.documents.length !== 1 ? 's' : ''} • Last Updated:{' '}
									{formatDate(chapter.documents[0]?.updated_at)}
								</p>
							</div>
						</button>
						<div className="p-4 pr-5" onClick={(e) => e.stopPropagation()}>
							{document.status === 'need revision' && (
								<DocumentRevisionDialog document={document} refresh={refresh} />
							)}
						</div>
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className="border-t border-border/50 bg-muted/20 px-5 py-2">
						{chapter.documents.length === 0 ? (
							<div className="text-center py-4 text-muted-foreground text-sm">
								No documents uploaded yet
							</div>
						) : (
							<div className="space-y-1">
								{chapter.documents.map((doc) => (
									<ChapterItem
										key={doc.id}
										currentDocument={doc}
										projectAdviser={projectAdviser}
										refresh={refresh}
									/>
								))}
							</div>
						)}
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
	// return (
	// 	<>
	// 		{mainDocuments.map((doc) => (
	// 			<Card key={doc.id} className="hover:shadow-md transition-shadow">
	// 				<CardHeader className="pb-3">
	// 					<div className="flex items-start justify-between">
	// 						<div className="flex items-center gap-3">
	// 							<div className="p-3 rounded-xl bg-primary/10">
	// 								<FileText className="h-6 w-6 text-primary" />
	// 							</div>
	// 							<div>
	// 								<CardTitle className="text-base">{doc.title_name}</CardTitle>
	// 								<div className="text-xs text-muted-foreground flex gap-2 items-center">
	// 									<div className="inline-flex gap-1 items-center">
	// 										<History className="h-3.5 w-3.5" />
	// 										v1{' '}
	// 									</div>
	// 									<div className="inline-flex gap-1 items-center">
	// 										<Calendar className="h-3.5 w-3.5" />{' '}
	// 										{formatDate(doc.created_at)}
	// 									</div>
	// 								</div>
	// 							</div>
	// 						</div>
	// 						<div
	// 							className={cn(
	// 								'py-0.5 px-3 flex gap-1 items-center text-amber-500 rounded-full mt-1 border',
	// 								doc.status === 'pending' && statusColor.pending,
	// 								doc.status === 'under review' && statusColor['under review'],
	// 								doc.status === 'need revision' &&
	// 									statusColor['need revision'],
	// 								doc.status === 'approved' && statusColor.approved,
	// 							)}
	// 						>
	// 							<Clock className="h-3 w-3" />
	// 							<p className="text-xs font-medium capitalize">{doc.status}</p>
	// 						</div>
	// 					</div>
	// 				</CardHeader>
	// 				<CardContent>
	// 					<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
	// 						{doc.description}
	// 					</p>
	// 					<div className="flex items-center justify-between">
	// 						<div className="flex items-center gap-4 text-sm text-muted-foreground">
	// 							<span className="flex items-center gap-1">
	// 								<MessageSquare className="h-4 w-4" />
	// 								{doc.comments.length} comments
	// 							</span>
	// 							<span className="flex items-center gap-1"></span>
	// 						</div>

	// 						<Button
	// 							size="sm"
	// 							onClick={() => {
	// 								setSelectedDocumentId(doc.id);
	// 								setOpen(true);
	// 							}}
	// 						>
	// 							<Eye className="h-4 w-4 mr-0.5" />
	// 							View Details
	// 						</Button>
	// 					</div>
	// 				</CardContent>
	// 				{selectedDocumentId !== null && (
	// 					<DocumentViewDialog
	// 						documents={documents}
	// 						selectedDocumentId={selectedDocumentId}
	// 						open={open}
	// 						setOpen={setOpen}
	// 					/>
	// 				)}
	// 			</Card>
	// 		))}
	// 	</>
	// );
};

export default ChaptersDocument;
