import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ActivityIcon,
	BookOpen,
	Calendar,
	ChevronDown,
	ChevronRight,
	Folder,
	User,
	User2,
	Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import type { ProjectCollapseProps } from '../../interface/adviserdocument';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/components/functions/functions';
import type { DocumentProps } from '@/components/Student/interface/document';
import ViewDocuments from './ViewDocuments';

const DocumentProjectCard = ({
	documents,
	project,
	refresh,
	isExpanded,
	expandedChapters,
	onToggle,
	onToggleChapter,
	onSelectDocument,
}: ProjectCollapseProps) => {
	const [open, setOpen] = useState(false);
	const studentIds = project.details.map((detail) => detail.student_id);
	const filterDocuments = documents.filter((d) =>
		studentIds.includes(d.student_id),
	);
	const chaptersGrouped = useMemo(() => {
		if (filterDocuments.length === 0) return [];
		const parents = documents.filter((d) => d.parent_document_id === null);
		const groupedDocuments = parents.map((parent) => {
			const versions = documents
				.filter((d) => d.parent_document_id === parent.id)
				.sort((a, b) => b.version - a.version);

			return { ...parent, versions };
		});
		const byChapter: Record<number, typeof groupedDocuments> = {};
		groupedDocuments.forEach((doc) => {
			if (!byChapter[doc.chapter]) byChapter[doc.chapter] = [];
			byChapter[doc.chapter].push(doc);
		});

		return Object.entries(byChapter).map(([chapter, docs]) => ({
			chapter: Number(chapter),
			documents: docs,
		}));
	}, [documents, filterDocuments]);

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
									{chaptersGrouped.length} chapters
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
						{studentIds.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground text-sm">
								No students assigned to this project or no documents uploaded
								yet
							</div>
						) : (
							<div className="p-4 space-y-2">
								{chaptersGrouped.map((chapter) => (
									<ViewDocuments
										key={chapter.chapter}
										chapter={chapter}
										isExpanded={expandedChapters.has(chapter.chapter)}
										onToggle={() => onToggleChapter(chapter.chapter)}
										onSelectDocument={onSelectDocument}
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

export default DocumentProjectCard;
