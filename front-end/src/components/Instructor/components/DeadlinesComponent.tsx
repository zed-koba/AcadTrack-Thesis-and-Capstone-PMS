import { Card, CardContent } from '@/components/ui/card';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CalendarIcon,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Edit,
	FileText,
	MinusCircle,
	Plus,
	XCircle,
} from 'lucide-react';
import type { DeadlineComponentProps, Deadlines } from '../interface/deadlines';
import { isFuture } from 'date-fns/isFuture';
import { isPast } from 'date-fns/isPast';
import { differenceInDays, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SetDeadlineComponent from './SetDeadlineComponent';
import { useState } from 'react';
import DeadlineDeleteComponent from './DeadlineDeleteComponent';
import { Progress } from '@/components/ui/progress';

const DeadlinesComponent = ({
	projects,
	deadlines,
	refresh,
}: DeadlineComponentProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [openDelete, setDeleteOpen] = useState(false);
	const [deadline, setDeadline] = useState<Deadlines | null>(null);
	const [expandedDeadlines, setExpandedDeadlines] = useState<
		Record<number, boolean>
	>({});
	const activeDeadlines =
		(deadlines || [])
			.filter((d) => isFuture(new Date(d.deadline)))
			.sort(
				(a, b) =>
					new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
			) || [];
	const passedDeadlines =
		(deadlines || [])
			.filter((d) => isPast(new Date(d.deadline)))
			.sort(
				(a, b) =>
					new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
			) || [];
	const toggleExpanded = (id: number) =>
		setExpandedDeadlines((prev) => ({ ...prev, [id]: !prev[id] }));

	const getGroupStatusForDeadline = (deadline: Deadlines) => {
		const documentName = deadline.document_title.toLowerCase();

		return projects?.map((project) => {
			const studentDocs =
				project.details?.flatMap((d) => d.student.document ?? []) ?? [];

			const leaderDocs = project.group_leader?.document ?? [];

			const allDocuments = [...studentDocs, ...leaderDocs];

			const matchingDocument = allDocuments.find(
				(doc) =>
					doc.status === 'passed' &&
					doc.title_name?.toLowerCase().includes(documentName),
			);
			const submissionStatus = matchingDocument
				? new Date(matchingDocument.passed_date) <= new Date(deadline.deadline)
					? 'submitted-on-time'
					: 'submitted-late'
				: isPast(new Date(deadline.deadline))
					? 'missed'
					: 'pending';
			return {
				project,
				matchingDocument,
				submissionStatus,
			};
		});
	};

	return (
		<>
			<div className="pt-4">
				<h2 className="text-lg font-semibold text-white">Document Deadlines</h2>
				<div className="flex items-center justify-between mt-2 mb-4">
					<h4 className="text-sm font-medium flex items-center gap-2">
						<Calendar className="h-4 w-4 text-primary" />
						Active Deadlines ({activeDeadlines.length})
					</h4>
					<Button
						onClick={() => {
							setDeadline(null);
							setDialogOpen(true);
						}}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Deadline
					</Button>
				</div>
				{activeDeadlines.length === 0 ? (
					<Card className="bg-muted/30">
						<CardContent className="p-6 text-center text-muted-foreground">
							No active deadlines. Click "Add Deadline" to create one.
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-3">
						{activeDeadlines.map((deadline) => {
							const groupStatuses = getGroupStatusForDeadline(deadline) ?? [];

							const submitted = groupStatuses?.filter(
								(s) =>
									s.submissionStatus === 'submitted-on-time' ||
									s.submissionStatus === 'submitted-late',
							);
							const isExpanded = !!expandedDeadlines[deadline.id];

							return (
								<Card className="p-0" key={deadline.id}>
									<CardContent className="p-4 space-y-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<h4 className="font-semibold flex items-center gap-2">
													<FileText className="h-4 w-4" />
													{deadline.document_title}
												</h4>

												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<CalendarIcon className="h-3.5 w-3.5" />
													Due Date:{' '}
													{format(new Date(deadline.deadline), 'MMMM dd, yyyy')}
													<span className="text-xs">
														(
														{differenceInDays(
															new Date(deadline.deadline),
															new Date(),
														)}{' '}
														days left)
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<Badge
													variant="outline"
													className="bg-primary/10 text-primary border-primary/30"
												>
													Active
												</Badge>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => {
														setDeadline(deadline);
														setDialogOpen(true);
													}}
												>
													<Edit className="h-4 w-4" />
												</Button>
											</div>
										</div>
										{/* Group Submission Progress Summary */}
										<div className="border-t pt-3">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
													<BookOpen className="h-3.5 w-3.5" />
													Group Submissions: {submitted?.length ?? 0}/
													{projects?.length}
												</span>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs gap-1"
													onClick={() => toggleExpanded(deadline.id)}
												>
													{isExpanded ? (
														<ChevronUp className="h-3 w-3" />
													) : (
														<ChevronDown className="h-3 w-3" />
													)}
													{isExpanded ? 'Hide' : 'View Groups'}
												</Button>
											</div>
											<Progress
												value={
													projects && projects.length > 0
														? ((submitted?.length ?? 0) / projects.length) * 100
														: 0
												}
												className="h-1.5"
											/>
										</div>
										{/* Expandable Group Status List */}
										{isExpanded && (
											<div className="space-y-1.5 pt-1">
												{groupStatuses.map((project) => (
													<div
														key={project.project.id}
														className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 text-sm"
													>
														<div>
															<p className="font-medium text-xs">
																{project.project.title}
															</p>
															<p className="text-[11px] text-muted-foreground">
																{project.project.group_leader.name}
																{project.project.details
																	? ',' +
																		project.project.details
																			.map((detail) => detail.student.name)
																			.flat()
																			.join(', ')
																	: ''}
															</p>
														</div>
														<div className="flex items-center gap-2">
															{project.matchingDocument?.passed_date && (
																<span className="text-[10px] text-muted-foreground">
																	{format(
																		new Date(
																			project.matchingDocument.passed_date,
																		),
																		'MMM dd, yyyy',
																	)}
																</span>
															)}
															{project.submissionStatus ===
																'submitted-on-time' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-green-500/10 text-green-600 border-green-500/30"
																>
																	<CheckCircle className="h-3 w-3" /> On Time
																</Badge>
															)}
															{project.submissionStatus ===
																'submitted-late' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
																>
																	<AlertTriangle className="h-3 w-3" /> Late
																</Badge>
															)}
															{project.submissionStatus === 'pending' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-muted text-muted-foreground"
																>
																	<MinusCircle className="h-3 w-3" /> Not Passed
																</Badge>
															)}
															{project.submissionStatus === 'missed' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-destructive/10 text-destructive border-destructive/30"
																>
																	<XCircle className="h-3 w-3" /> Missed
																</Badge>
															)}
														</div>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>

			{/* Passed Deadlines */}
			{passedDeadlines.length > 0 && (
				<div>
					<h4 className="text-sm font-medium flex items-center gap-2 mt-4 mb-4">
						<AlertTriangle className="h-4 w-4 text-destructive" />
						Passed Deadlines ({passedDeadlines.length})
					</h4>
					<div className="grid gap-3">
						{passedDeadlines.map((deadline) => {
							const groupStatuses = getGroupStatusForDeadline(deadline) ?? [];
							const submitted = groupStatuses?.filter(
								(s) =>
									s.submissionStatus === 'submitted-on-time' ||
									s.submissionStatus === 'submitted-late',
							);
							const isExpanded = !!expandedDeadlines[deadline.id];
							return (
								<Card key={deadline.id} className="opacity-80 p-0">
									<CardContent className="p-4 space-y-3">
										<div className="flex items-center justify-between">
											<div>
												<h4 className="font-medium text-sm flex items-center gap-2">
													<FileText className="h-4 w-4" />
													{deadline.document_title}
												</h4>
												<p className="text-xs text-muted-foreground">
													Due Date:{' '}
													{format(new Date(deadline.deadline), 'MMM dd, yyyy')}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant="outline"
													className="bg-destructive/10 text-destructive border-destructive/30"
												>
													Passed
												</Badge>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs gap-1"
													onClick={() => toggleExpanded(deadline.id)}
												>
													{isExpanded ? (
														<ChevronUp className="h-3 w-3" />
													) : (
														<ChevronDown className="h-3 w-3" />
													)}
													{submitted.length}/{groupStatuses.length} submitted
												</Button>
											</div>
										</div>
										{isExpanded && (
											<div className="space-y-1.5 border-t pt-3">
												{groupStatuses.map((project) => (
													<div
														key={project.project.id}
														className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 text-sm"
													>
														<div>
															<p className="font-medium text-xs">
																{project.project.title}
															</p>
															<p className="text-[11px] text-muted-foreground">
																{project.project.group_leader.name}
																{project.project.details ? ', ' : ''}
																{project.project.details
																	? project.project.details
																			.map((detail) => detail.student.name)
																			.flat()
																			.join(', ')
																	: ''}
															</p>
														</div>
														<div className="flex items-center gap-2">
															{project.matchingDocument?.passed_date && (
																<span className="text-[10px] text-muted-foreground">
																	{format(
																		new Date(
																			project.matchingDocument.passed_date,
																		),
																		'MMM dd, yyyy',
																	)}
																</span>
															)}
															{project.submissionStatus ===
																'submitted-on-time' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-green-500/10 text-green-600 border-green-500/30"
																>
																	<CheckCircle className="h-3 w-3" /> On Time
																</Badge>
															)}
															{project.submissionStatus ===
																'submitted-late' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
																>
																	<AlertTriangle className="h-3 w-3" /> Late
																</Badge>
															)}
															{project.submissionStatus === 'missed' && (
																<Badge
																	variant="outline"
																	className="text-[10px] px-1.5 gap-1 bg-destructive/10 text-destructive border-destructive/30"
																>
																	<XCircle className="h-3 w-3" /> Missed
																</Badge>
															)}
														</div>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			)}
			{dialogOpen && (
				<SetDeadlineComponent
					deadline={deadline}
					refresh={refresh}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
				/>
			)}
			{openDelete && deadline && (
				<DeadlineDeleteComponent
					deadline_id={deadline.id}
					refresh={refresh}
					open={openDelete}
					setOpen={setDeleteOpen}
				/>
			)}
		</>
	);
};

export default DeadlinesComponent;
