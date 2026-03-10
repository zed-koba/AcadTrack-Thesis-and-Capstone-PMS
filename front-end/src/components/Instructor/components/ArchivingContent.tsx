import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Archive,
	CheckCircle2,
	Clock,
	Download,
	Eye,
	Search,
} from 'lucide-react';

const ArchivingContent = () => {
	return (
		<>
			<Tabs defaultValue="pending" className="space-y-4">
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
							<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
								<Badge variant="outline" className="text-xs">
									Student Submits
								</Badge>
								<span>→</span>
								<Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
									Adviser Approves ✓
								</Badge>
								<span>→</span>
								<Badge
									variant="outline"
									className="border-primary/50 text-primary text-xs font-semibold"
								>
									Instructor Confirms (You)
								</Badge>
								<span>→</span>
								<Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
									Auto-Archived
								</Badge>
							</div>

							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Project Title</TableHead>
										<TableHead>Group</TableHead>
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
														{doc.projectTitle}
													</p>
													<p className="text-xs text-muted-foreground">
														{doc.members.join(', ')}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{doc.groupName}</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="secondary">{doc.program}</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.adviserApprovedBy}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.adviserApprovedDate.toLocaleDateString()}
											</TableCell>
											<TableCell>
												<Badge variant="outline">v{doc.version}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button
													size="sm"
													onClick={() => {
														setSelectedDoc(doc);
														setDialogOpen(true);
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
								<Select value={filterYear} onValueChange={setFilterYear}>
									<SelectTrigger className="w-[160px]">
										<SelectValue placeholder="Academic Year" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Years</SelectItem>
										{uniqueYears.map((y) => (
											<SelectItem key={y} value={y}>
												{y}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									value={filterSemester}
									onValueChange={setFilterSemester}
								>
									<SelectTrigger className="w-[160px]">
										<SelectValue placeholder="Semester" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Semesters</SelectItem>
										<SelectItem value="1st Semester">1st Semester</SelectItem>
										<SelectItem value="2nd Semester">2nd Semester</SelectItem>
									</SelectContent>
								</Select>
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
										<TableHead>Group</TableHead>
										<TableHead>Program</TableHead>
										<TableHead>Semester</TableHead>
										<TableHead>Adviser Approved</TableHead>
										<TableHead>Archived Date</TableHead>
										<TableHead>Size</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredArchived.map((doc) => (
										<TableRow key={doc.id}>
											<TableCell>
												<div>
													<p className="font-medium text-foreground">
														{doc.projectTitle}
													</p>
													<p className="text-xs text-muted-foreground">
														{doc.members.join(', ')}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{doc.groupName}</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="secondary">{doc.program}</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.semester} {doc.academicYear}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.approvedBy}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.archivedDate.toLocaleDateString()}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{doc.fileSize}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
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

			<FinalApprovalDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				document={selectedDoc}
				onConfirm={handleConfirmArchive}
				onReject={handleRejectDoc}
			/>
		</>
	);
};

export default ArchivingContent;
