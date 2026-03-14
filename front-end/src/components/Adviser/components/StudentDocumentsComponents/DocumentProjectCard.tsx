import {
	BookOpen,
	Calendar,
	ChevronDown,
	ChevronRight,
	Folder,
	User,
	Users,
} from 'lucide-react';
import { useMemo } from 'react';

import type { ProjectCollapseProps } from '../../interface/adviserdocument';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import { formatDate } from '@/components/functions/functions';

import DocumentItem from './DocumentItem';

const DocumentProjectCard = ({
	documents,
	project,
	isExpanded,
	onToggle,
	projectAdviser,
	setProjectAdviser,
	onSelectDocument,
	selectedDocument,
}: ProjectCollapseProps) => {
	const studentIds = [
		project.group_leader.id,
		...project.details.map((detail) => detail.student_id),
	];

	const filterDocuments = documents.filter((d) =>
		studentIds.includes(d.student_id),
	);

	const documentsGrouped = useMemo(() => {
		const parents = filterDocuments.filter(
			(d) => d.parent_document_id === null,
		);
		const groupedDocuments = parents.map((parent) => {
			const versions = filterDocuments
				.filter((d) => d.parent_document_id === parent.id)
				.sort((a, b) => b.version - a.version);
			console.log(parent);
			return { ...parent, versions };
		});
		console.log(parents);
		return groupedDocuments;
	}, [filterDocuments]);

	return (
		<Collapsible open={isExpanded} onOpenChange={onToggle}>
			<div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow ">
				<CollapsibleTrigger asChild>
					<button className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left cursor-pointer">
						<div className="flex items-center gap-2">
							{isExpanded ? (
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							) : (
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							)}
							<div
								className={cn(
									'p-2 rounded-lg',
									isExpanded ? 'bg-primary/10' : 'bg-muted',
								)}
							>
								<BookOpen
									className={cn(
										'h-5 w-5',
										isExpanded ? 'text-primary' : 'text-muted-foreground',
									)}
								/>
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="font-semibold truncate">{project.title}</span>
							</div>
							<div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
								<span className="flex items-center gap-1">
									<Users className="h-3 w-3" />
									{studentIds.length === 0
										? 'No students assigned'
										: project.details.map((m) => m.student.name).join(', ')}
								</span>
								<span className="flex items-center gap-1">
									<User className="h-3 w-3" />
									{project.adviser.name}
								</span>
								<span className="flex items-center gap-1">
									<Folder className="h-3 w-3" />
									{filterDocuments.length} documents
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{formatDate(project.updated_at)}
								</span>
							</div>
						</div>
					</button>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className="border-t border-border bg-muted/10">
						<div className="p-4 space-y-2">
							{documentsGrouped.map((doc) => (
								<DocumentItem
									key={doc.id}
									currentDocument={doc}
									onSelectDocument={onSelectDocument}
									selectedDocument={selectedDocument}
									projectAdviser={projectAdviser}
									setProjectAdviser={setProjectAdviser}
								/>
							))}
							{documentsGrouped.length === 0 && (
								<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
									<Folder className="h-12 w-12 mb-4 opacity-50" />
									<p className="font-medium">No documents found</p>
								</div>
							)}
						</div>
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
};

export default DocumentProjectCard;
