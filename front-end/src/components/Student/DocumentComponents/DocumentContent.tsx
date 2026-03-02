import { Book, Folder, Info, Search } from 'lucide-react';
import DocumentUploadDialog from './DocumentUploadDialog';
import type { DocumentContentProps } from '../interface/document';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChapterItem from './ChapterItem';

const DocumentContent = ({
	documents,
	project,
	deadlines,
	refresh,
}: DocumentContentProps) => {
	const studentIds = project?.details.map((v) => v.student_id);
	const filterDocuments = useMemo(() => {
		return documents.filter((doc) => studentIds?.includes(doc.student_id));
	}, [documents, studentIds]);

	const [searchQuery, setSearchQuery] = useState('');
	const documentsGrouped = useMemo(() => {
		const parents = filterDocuments.filter(
			(d) => d.parent_document_id === null,
		);
		const groupedDocuments = parents.map((parent) => {
			const versions = filterDocuments
				.filter((d) => d.parent_document_id === parent.id)
				.sort((a, b) => b.version - a.version);
			return { ...parent, versions };
		});
		return groupedDocuments;
	}, [filterDocuments]);
	const filteredDocumentsGrouped = useMemo(() => {
		return documentsGrouped.filter((doc) => {
			const versionFiles = doc.versions
				.map((v) => v.original_name.toLowerCase())
				.join(' ');
			const matchesSearch =
				doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				versionFiles.includes(searchQuery.toLowerCase());

			return matchesSearch;
		});
	}, [documentsGrouped, searchQuery]);

	const needRevisionDocs = filteredDocumentsGrouped.filter((d) =>
		d.versions.length > 0
			? d.versions[0].status === 'need revision'
			: d.status === 'need revision',
	);

	return (
		<>
			{needRevisionDocs.length > 0 && (
				<div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20">
					<Info className="h-5 w-5 text-red-500 shrink-0" />
					<p className="text-sm text-white">
						<strong className="text-red-600">
							{needRevisionDocs.length} document{' '}
						</strong>{' '}
						need revision. Click the "Submit Revision" button on the document to
						upload a revised version.
					</p>
				</div>
			)}
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
											Thesis/Capstone Documents
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-0.5">
											{filteredDocumentsGrouped.length} total submitted
											documents
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<DocumentUploadDialog
										refresh={refresh}
										deadlines={deadlines}
									/>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
								<div className="relative flex-1 w-full sm:max-w-sm">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search file name..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 bg-background rounded-sm"
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-4">
							<ScrollArea className="h-[650px]">
								{filteredDocumentsGrouped.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
										<Folder className="h-12 w-12 mb-4 opacity-50" />
										<p className="font-medium">No documents found</p>
									</div>
								) : (
									<div className="space-y-4">
										{/* {filteredChaptersGrouped.map((chapter) => (
											<ChaptersDocument
												key={chapter.chapter}
												chapter={chapter}
												isExpanded={expandedChapters.has(chapter.chapter)}
												onToggle={() => toggleChapter(chapter.chapter)}
												projectAdviser={project?.adviser ?? null}
												refresh={refresh}
											/>
										))} */}
										{filteredDocumentsGrouped.map((doc) => (
											<ChapterItem
												key={doc.id}
												currentDocument={doc}
												projectAdviser={project?.adviser ?? null}
												refresh={refresh}
											/>
										))}
									</div>
								)}
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
				{/* {selectedDocument && (
					<DocumentsComments
						document={selectedDocument}
						refresh={refresh}
						loading={loading}
						adviser={projectAdviser}
						setSelectedDocument={setSelectedDocument}
					/>
				)} */}
			</section>
		</>
	);
};

export default DocumentContent;
