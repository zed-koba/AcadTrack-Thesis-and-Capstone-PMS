import { BarChart3, Filter, Folder, LibraryBig, Search } from 'lucide-react';
import type { DocumentProps } from '@/components/Student/interface/document';
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentProjectCard from './DocumentProjectCard';
import type { AdviserDocumentContentProps } from '../../interface/adviserdocument';
import DocumentsComments from './DocumentComments';
import { cn } from '@/lib/utils';

const DocumentContent = ({
	documents,
	projects,
	refresh,
	loading,
	selectedDocument,
	setSelectedDocument,
}: AdviserDocumentContentProps) => {
	const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
		new Set([projects[0].proponents_id]),
	);
	const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
		new Set(),
	);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('latest');

	const toggleProject = (projectId: string) => {
		const newExpanded = new Set(expandedProjects);
		if (newExpanded.has(projectId)) {
			newExpanded.delete(projectId);
		} else {
			newExpanded.add(projectId);
		}
		setExpandedProjects(newExpanded);
	};

	const toggleChapter = (chapterId: number) => {
		const newExpanded = new Set(expandedChapters);
		if (newExpanded.has(chapterId)) {
			newExpanded.delete(chapterId);
		} else {
			newExpanded.add(chapterId);
		}
		setExpandedChapters(newExpanded);
	};
	const MIN_WIDTH = 500;
	const MAX_WIDTH = 1000;

	const containerRef = useRef<HTMLDivElement | null>(null);

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;

		const startX = e.clientX;
		const sidebar = containerRef.current.children[0] as HTMLElement;
		const startWidth = sidebar.offsetWidth;

		const onMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const delta = e.clientX - startX;
			const nextWidth = startWidth + delta;

			const clampedWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, nextWidth));

			containerRef.current.style.gridTemplateColumns = `${clampedWidth}px 1fr`;
		};

		const onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};

	return (
		<>
			<section
				className="w-full grid h-auto relative"
				ref={containerRef}
				style={{ gridTemplateColumns: '1000px 1fr' }}
			>
				<div
					className={cn(
						'relative text-white mr-5 overflow-hidden',
						!selectedDocument ? 'col-span-2' : '',
					)}
				>
					<Card className="border-border">
						<CardHeader className="pb-4 border-b border-border">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="p-3 rounded-md bg-primary/10">
										<LibraryBig className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">
											Capstone/Thesis Projects
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-0.5">
											1 projects • 1 total chapters
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2"></div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
								<div className="relative flex-1 w-full sm:max-w-sm">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search projects, students, or documents..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 bg-background rounded-sm"
									/>
								</div>
								<div className="flex items-center gap-2 w-full sm:w-auto">
									<Select value={statusFilter} onValueChange={setStatusFilter}>
										<SelectTrigger className="w-40 bg-background rounded-sm">
											<Filter className="h-4 w-4 mr-2" />
											<SelectValue placeholder="Filter" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="pending">Pending Review</SelectItem>
											<SelectItem value="needs-revision">
												Needs Revision
											</SelectItem>
											<SelectItem value="approved">Approved</SelectItem>
										</SelectContent>
									</Select>
									<Select value={sortBy} onValueChange={setSortBy}>
										<SelectTrigger className="w-full bg-background rounded-sm">
											<BarChart3 className="h-4 w-4 mr-2" />
											<SelectValue placeholder="Sort" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="latest">Latest First</SelectItem>
											<SelectItem value="name">By Name</SelectItem>
											<SelectItem value="progress">By Progress</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-4">
							<ScrollArea className="h-[600px] pr-4">
								{projects.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
										<Folder className="h-12 w-12 mb-4 opacity-50" />
										<p className="font-medium">No projects found</p>
									</div>
								) : (
									<div className="space-y-4">
										{projects.map((project) => (
											<DocumentProjectCard
												key={project.id}
												documents={documents}
												project={project}
												isExpanded={expandedProjects.has(project.proponents_id)}
												expandedChapters={expandedChapters}
												onToggle={() => toggleProject(project.proponents_id)}
												onToggleChapter={toggleChapter}
												onSelectDocument={setSelectedDocument}
												refresh={refresh}

												// onViewDocument={onViewDocument}
												// onDownload={onDownload}
												// onChangeStatus={onChangeStatus}
												// onViewHistory={onViewHistory}
												// onViewProject={onViewProject}
											/>
										))}
									</div>
								)}
							</ScrollArea>
						</CardContent>
						{/* ); */}
					</Card>

					{/* {selectedStudent ? (
						<>
							<div className="flex justify-between wrap-normal flex-wrap">
								<div className="grid grid-cols-2 grow shrink-0">
									<InputGroup>
										<InputGroupInput placeholder="Search students..." />
										<InputGroupAddon>
											<Search className="h-5 w-5" />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											0 results...
										</InputGroupAddon>
									</InputGroup>
								</div>
							</div>
							<div className="grid gap-3 xl:grid-cols-4 lg: grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
								<DocumentStudentCard
									documents={documents}
									setSelectedStudent={setSelectedStudent}
									setSelectedStudentDocuments={setSelectedStudentDocuments}
									refresh={refresh}
								/>
							</div>
						</>
					) : (
						<ViewDocuments
							documents={selectedStudentDocuments}
							setSelectedStudent={setSelectedStudent}
							refresh={refresh}
						/>
					)} */}
					<div
						onMouseDown={onMouseDown}
						className="absolute top-1.5 right-0 h-full w-[3px] rounded-lg mb-2 cursor-col-resize bg-border hover:bg-primary "
					/>
				</div>
				{selectedDocument && (
					<DocumentsComments
						document={selectedDocument}
						refresh={refresh}
						loading={loading}
					/>
				)}
			</section>
		</>
	);
};

export default DocumentContent;
