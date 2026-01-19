import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Book, Search } from 'lucide-react';
import DocumentCard from './DocumentCard';
import DocumentUploadDialog from './DocumentUploadDialog';
import type { DocumentContentProps } from '../interface/document';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { Input } from '@/components/ui/input';

const DocumentContent = ({
	documents,
	project,
	refresh,
}: DocumentContentProps) => {
	const filterDocuments = useMemo(() => {
		return documents.filter(
			(doc) => doc.parent_document_id === null && doc.student_id === 1,
		);
	}, [documents]);
	const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
		new Set(),
	);
	return (
		<>
			<section className="w-full h-auto">
				<div
					className={cn('relative text-white overflow-hidden  md:max-w-none')}
				>
					<Card className="border-border">
						<CardHeader className="pb-4 border-b border-border">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="p-3 rounded-md bg-primary/10">
										<Book className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">
											Documents Chapters
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-0.5">
											{projects.length} chapters • {documents.length} total
											submitted documents
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2"></div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
								<div className="relative flex-1 w-full sm:max-w-sm">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search projects, project ID, or student name/ID..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 bg-background rounded-sm"
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-4">
							<ScrollArea className="h-[650px]">
								{filterProjects.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
										<Folder className="h-12 w-12 mb-4 opacity-50" />
										<p className="font-medium">No projects found</p>
									</div>
								) : (
									<div className="space-y-4">
										{filterProjects.map((project) => (
											<DocumentProjectCard
												key={project.id}
												documents={documents}
												project={project}
												isExpanded={expandedProjects.has(project.proponents_id)}
												expandedChapters={expandedChapters}
												onToggle={() => toggleProject(project.proponents_id)}
												onToggleChapter={toggleChapter}
												onSelectDocument={setSelectedDocument}
												selectedDocument={selectedDocument}
												refresh={refresh}
												projectAdviser={project.adviser}
												setProjectAdviser={setProjectAdviser}
												onStatusChange={onStatusChange}
											/>
										))}
									</div>
								)}
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
				{selectedDocument && (
					<DocumentsComments
						document={selectedDocument}
						refresh={refresh}
						loading={loading}
						adviser={projectAdviser}
						setSelectedDocument={setSelectedDocument}
					/>
				)}
			</section>
		</>
		// <>
		// 	<section className="space-y-4 w-full">
		// 		<div className="space-y-6 text-white">
		// 			<div className="flex justify-between wrap-normal flex-wrap">
		// 				<div className="grid grid-cols-2 max-w-160 grow shrink-0">
		// 					<InputGroup>
		// 						<InputGroupInput placeholder="Search...." />
		// 						<InputGroupAddon>
		// 							<Search className="h-5 w-5" />
		// 						</InputGroupAddon>
		// 						<InputGroupAddon align="inline-end">
		// 							0 results...
		// 						</InputGroupAddon>
		// 					</InputGroup>
		// 				</div>
		// 				<DocumentUploadDialog refresh={refresh} />
		// 			</div>
		// 			<div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
		// 				<DocumentCard documents={documents} />
		// 			</div>
		// 		</div>
		// 	</section>
		// </>
	);
};

export default DocumentContent;
