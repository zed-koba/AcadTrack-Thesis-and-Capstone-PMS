import {
	BookOpen,
	Calendar,
	ChevronDown,
	ChevronRight,
	Folder,
	FolderOpen,
	User,
	Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { ProjectCollapseProps } from '../../interface/adviserdocument';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
	chapterStatusIcon,
	formatDate,
	getProjectStatus,
	statusColor,
} from '@/components/functions/functions';

import ViewDocuments from './ViewDocuments';

const DocumentProjectCard = ({
	documents,
	project,
	refresh,
	isExpanded,
	expandedChapters,
	onToggle,
	projectAdviser,
	onToggleChapter,
	setProjectAdviser,
	onStatusChange,
	onSelectDocument,
	selectedDocument,
}: ProjectCollapseProps) => {
	const [open, setOpen] = useState(false);
	const studentIds = project.details.map((detail) => detail.student_id);
	const [extraChapter, setExtraChapter] = useState(false);
	const filterDocuments = documents.filter((d) =>
		studentIds.includes(d.student_id),
	);
	const chaptersGrouped = useMemo(() => {
		const parents = filterDocuments.filter(
			(d) => d.parent_document_id === null,
		);
		const groupedDocuments = parents.map((parent) => {
			const versions = filterDocuments
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
	const status = useMemo(
		() =>
			chaptersGrouped.length === 0
				? 'no documents'
				: getProjectStatus(chaptersGrouped),
		[chaptersGrouped],
	);
	useEffect(() => {
		if (onStatusChange) {
			onStatusChange(project.id, status ?? 'no documents');
		}
	}, [status, onStatusChange, project.id]);
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
								<Badge
									variant="outline"
									className={cn(
										'gap-1 shrink-0 capitalize',
										statusColor[
											getProjectStatus(
												chaptersGrouped,
											) as keyof typeof statusColor
										],
									)}
								>
									{
										chapterStatusIcon[
											getProjectStatus(
												chaptersGrouped,
											) as keyof typeof chapterStatusIcon
										]
									}
									{getProjectStatus(chaptersGrouped)}
								</Badge>
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
						<div className="p-4 space-y-2">
							{chaptersGrouped.map((chapter) => (
								<ViewDocuments
									key={chapter.chapter}
									chapter={chapter}
									isExpanded={expandedChapters.has(chapter.chapter)}
									onToggle={() => onToggleChapter(chapter.chapter)}
									onSelectDocument={onSelectDocument}
									projectAdviser={projectAdviser}
									setProjectAdviser={setProjectAdviser}
									selectedDocument={selectedDocument}
									refresh={refresh}
								/>
							))}
							{(getProjectStatus(chaptersGrouped) === 'approved' ||
								chaptersGrouped.length === 0) && (
								<Collapsible open={extraChapter} onOpenChange={setExtraChapter}>
									<div className="rounded-lg border border-border/50 bg-background overflow-hidden">
										<CollapsibleTrigger asChild>
											<button className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors text-left cursor-pointer">
												<div className="flex items-center gap-2">
													{extraChapter ? (
														<ChevronDown className="h-3 w-3 text-muted-foreground cursor-pointer" />
													) : (
														<ChevronRight className="h-3 w-3 text-muted-foreground cursor-pointer" />
													)}
													{extraChapter ? (
														<FolderOpen className="h-4 w-4 text-primary cursor-pointer" />
													) : (
														<Folder className="h-4 w-4 text-muted-foreground cursor-pointer" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">
															Chapter{' '}
															{chaptersGrouped.length === 0
																? '1'
																: chaptersGrouped[chaptersGrouped.length - 1]
																		.chapter + 1}
														</span>
														<Badge
															variant="outline"
															className={cn('text-xs capitalize')}
														>
															No Document
														</Badge>
													</div>
													<p className="text-xs text-muted-foreground mt-0.5">
														0 document • Last Updated: Not Assigned
													</p>
												</div>
											</button>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<div className="border-t border-border/50 bg-muted/20 px-5 py-2">
												<div className="text-center py-4 text-muted-foreground text-sm">
													No documents uploaded yet
												</div>
											</div>
										</CollapsibleContent>
									</div>
								</Collapsible>
							)}
						</div>
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
};

export default DocumentProjectCard;
