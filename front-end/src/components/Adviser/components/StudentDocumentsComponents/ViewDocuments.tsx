import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import type { ViewDocumentsProps } from '../../interface/adviserdocument';
import {
	chapterStatusIcon,
	formatDate,
	statusColor,
} from '@/components/functions/functions';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

import DocumentItem from './DocumentItem';
import { Badge } from '@/components/ui/badge';

const ViewDocuments = ({
	chapter,
	isExpanded,
	onToggle,
	onSelectDocument,
	selectedDocument,
	setProjectAdviser,
	projectAdviser,
	refresh,
}: ViewDocumentsProps) => {
	const [open, setOpen] = useState(false);
	const status =
		chapter.documents[0].versions.length === 0
			? chapter.documents[0]?.status
			: chapter.documents[0].versions[0].status;

	return (
		<Collapsible open={isExpanded} onOpenChange={onToggle}>
			<div className={cn('rounded-lg border bg-background overflow-hidden')}>
				<CollapsibleTrigger asChild>
					<button className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors text-left cursor-pointer">
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
									Chapter {chapter ? chapter.chapter : '1'}
								</span>
								<Badge
									variant="outline"
									className={cn('text-xs capitalize', statusColor[status])}
								>
									{chapterStatusIcon[status]}
									{status}
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground mt-0.5">
								{chapter ? chapter.documents.length : '0'} document
								{chapter && chapter.documents.length !== 1 ? 's' : ''} • Last
								Updated:{' '}
								{chapter
									? formatDate(chapter.documents[0]?.updated_at)
									: 'Not Assigned'}
							</p>
						</div>
					</button>
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
									<DocumentItem
										key={doc.id}
										currentDocument={doc}
										onSelectDocument={onSelectDocument}
										selectedDocument={selectedDocument}
										projectAdviser={projectAdviser}
										setProjectAdviser={setProjectAdviser}
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
};

export default ViewDocuments;
