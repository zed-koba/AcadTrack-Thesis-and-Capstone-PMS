import { BarChart3, Filter, Folder, LibraryBig, Search } from 'lucide-react';
import { useState } from 'react';
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
import type { AdviserProps } from '@/components/Admin/interface/adviser';

const DocumentContent = ({
	documents,
	projects,
	refresh,
	loading,
	selectedDocument,
	setSelectedDocument,
}: AdviserDocumentContentProps) => {
	const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
		new Set(),
	);

	const [projectAdviser, setProjectAdviser] = useState<AdviserProps | null>(
		null,
	);

	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('latest');
	const filterProjects = projects
		.filter((project) => {
			const studentsList = project.details
				.map((detail) => detail.student.name.toLowerCase())
				.join(' ');
			const studentsIds = project.details
				.map((detail) => detail.student.student_id.toLowerCase())
				.join(' ');
			const matchesSearch =
				project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				studentsList.includes(searchQuery.toLowerCase()) ||
				project.proponents_id
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				studentsIds.includes(searchQuery.toLowerCase());

			if (statusFilter === 'all') return matchesSearch;
			return matchesSearch && project.status === statusFilter;
		})
		.sort((a, b) => {
			if (sortBy === 'latest')
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			if (sortBy === 'name') return a.title.localeCompare(b.title);
			return 0;
		});

	const toggleProject = (projectId: string) => {
		const newExpanded = new Set(expandedProjects);
		if (newExpanded.has(projectId)) {
			newExpanded.delete(projectId);
		} else {
			newExpanded.add(projectId);
		}
		setExpandedProjects(newExpanded);
	};

	return (
		<>
			<section className="w-full grid h-auto lg:grid-rows-[auto-1fr] xl:grid-rows-none xl:grid-cols-[1000px_1fr] gap-3">
				<div
					className={cn(
						'relative text-white overflow-hidden  md:max-w-none',
						!selectedDocument ? 'col-span-2' : 'xl:max-w-[1000px]',
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
											{projects.length} thesis/capstone • {documents.length}{' '}
											total submitted documents
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
								<div className="flex items-center gap-2 w-full sm:w-auto">
									<Select value={statusFilter} onValueChange={setStatusFilter}>
										<SelectTrigger className="w-40 bg-background rounded-sm">
											<Filter className="h-4 w-4 mr-2" />
											<SelectValue placeholder="Filter" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="under review">Under Review</SelectItem>
											<SelectItem value="needs revision">
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
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardHeader>
						<ScrollArea className="h-[650px]">
							<CardContent className="pt-4">
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
												onToggle={() => toggleProject(project.proponents_id)}
												onSelectDocument={setSelectedDocument}
												selectedDocument={selectedDocument}
												refresh={refresh}
												projectAdviser={project.adviser}
												setProjectAdviser={setProjectAdviser}
											/>
										))}
									</div>
								)}
							</CardContent>
						</ScrollArea>
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
	);
};

export default DocumentContent;
