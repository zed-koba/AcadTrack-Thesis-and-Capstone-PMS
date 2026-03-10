import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, CheckCircle2, Clock, Download, Search } from 'lucide-react';
import {
	type ArchivingPendingProps,
	type ArchivingContentProps,
} from '../interface/archiving';
import { format } from 'date-fns';
import { useState } from 'react';
import FinalApprovalDialog from './FinalApprovalDialog';
import { toast } from 'sonner';
import { apiInstructorUrl } from '@/Routes/http';
import { downloadDocument } from '@/components/functions/functions';

const ArchivingContent = ({
	documents,
	deadlines,
	archives,
	refresh,
}: ArchivingContentProps) => {
	const finalDeadlines = deadlines.map((deadline) => deadline.document_title);
	const [selectedDoc, setSelectedDoc] = useState<
		ArchivingPendingProps | undefined
	>();
	const [open, setOpen] = useState(false);
	const archivedDocuments = archives
		? archives.map((archive) => archive.foreign_proponents_id)
		: [];
	const pendingDocs = documents.filter(
		(doc) =>
			finalDeadlines.includes(doc.title_name) &&
			!archivedDocuments.includes(doc.student.project.proponents_id),
	);
	const [searchQuery, setSearchQuery] = useState('');
	const filteredArchived = archives.filter((doc) => {
		const matchesSearch =
			doc.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			doc.project.details.some((m) =>
				m.student.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		return matchesSearch;
	});

	return (
		<>
			<Tabs defaultValue="pending" className="space-y-4 mt-5">
				<TabsList>
					<TabsTrigger value="pending" className="gap-1.5">
						<Clock className="h-3.5 w-3.5" />
						Pending Final Approval
						{pendingDocs.length > 0 && (
							<Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
								{pendingDocs.length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="archived" className="gap-1.5">
						<Archive className="h-3.5 w-3.5" />
						Archived
					</TabsTrigger>
				</TabsList>

				{/* Pending Final Approval Tab */}
				<TabsContent value="pending">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								Adviser-Approved Documents Awaiting Your Confirmation
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Flow diagram */}
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Project Title</TableHead>
										<TableHead className="text-center">Project</TableHead>
										<TableHead>Program</TableHead>
										<TableHead>Adviser Approved By</TableHead>
										<TableHead>Approved Date</TableHead>
										<TableHead>Version</TableHead>
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pendingDocs.map((doc) => (
										<TableRow key={doc.id}>
											<TableCell>
												<div>
													<p className="font-medium text-foreground">
														{doc.title_name}
													</p>
													<p className="text-xs text-muted-foreground">
														{doc.student.project.details
															?.map((d) => d.student?.name)
															.filter(Boolean)
															.join(', ')}
													</p>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<Badge variant="outline">
													{doc.student.project.title}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="secondary">
													{doc.student.program.code}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.student.project.adviser.name}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{format(new Date(doc.approved_date), 'yyyy-MM-dd')}
											</TableCell>
											<TableCell>
												<Badge variant="outline">v{doc.version}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button
													size="sm"
													onClick={() => {
														setSelectedDoc(doc);
														setOpen(true);
													}}
												>
													<CheckCircle2 className="h-4 w-4 mr-1" />
													Review & Confirm
												</Button>
											</TableCell>
										</TableRow>
									))}
									{pendingDocs.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												className="text-center py-8 text-muted-foreground"
											>
												<Archive className="h-8 w-8 mx-auto mb-2 opacity-40" />
												No documents pending final approval.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Archived Tab */}
				<TabsContent value="archived">
					{/* Filters */}
					<Card className="mb-4">
						<CardContent className="pt-4 pb-4">
							<div className="flex flex-wrap gap-3">
								<div className="relative flex-1 min-w-[200px]">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by project, group, or member..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								Archived Documents ({filteredArchived.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Project Title</TableHead>

										<TableHead>Program</TableHead>
										<TableHead>Semester</TableHead>
										<TableHead>Adviser Approved</TableHead>
										<TableHead>Archived Date</TableHead>
										<TableHead>Version</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredArchived.map((doc) => (
										<TableRow key={doc.id}>
											<TableCell>
												<div>
													<p className="font-medium text-foreground">
														{doc.project.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{doc.project.details
															?.map((d) => d.student?.name)
															.filter(Boolean)
															.join(', ')}
													</p>
												</div>
											</TableCell>

											<TableCell>
												<Badge variant="secondary">
													{doc.project.group_leader.program.code}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.project.group_leader.semester}{' '}
												{doc.project.academic_yr}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.project.adviser.name}
											</TableCell>

											<TableCell className="text-muted-foreground text-sm">
												{format(new Date(doc.archived_date), 'yyyy-MM-dd')}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												<Badge variant="outline">v{doc.version}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => {
															downloadDocument(doc.id, doc.original_name);
														}}
													>
														<Download className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
									{filteredArchived.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={8}
												className="text-center py-8 text-muted-foreground"
											>
												No archived documents found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
			{selectedDoc && open && (
				<FinalApprovalDialog
					open={open}
					setOpen={setOpen}
					document={selectedDoc}
					refresh={refresh}
				/>
			)}
		</>
	);
};

export default ArchivingContent;
