import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import { information, studentIds } from '@/components/functions/functions';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableHeader,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@/components/ui/table';
import { ChevronRight, Search, Users } from 'lucide-react';
import {
	getRiskColor,
	type Deadlines,
	type RiskLevel,
} from '../interface/deadlines';
import { Button } from '@/components/ui/button';
import type { DocumentProps } from '@/components/Student/interface/document';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, isEqual } from 'date-fns';
import { Progress } from '@/components/ui/progress';

type GroupsComponentProps = {
	projects: ProponentsDocumentsProps[];
	documents: DocumentProps[];
	deadlines: Deadlines[];
};
const GroupsComponent = ({
	projects,
	documents,
	deadlines,
}: GroupsComponentProps) => {
	const filterProjects = projects.filter(
		(project) => project.group_leader.instructor_id === information.id,
	);

	const filterDeadlines = deadlines.filter(
		(deadline) => deadline.instructor_id === information.id,
	);
	const getRisklevel = (
		passedDocuments: number,
		totalDeadlines: number,
	): RiskLevel => {
		const calculate = (passedDocuments / totalDeadlines) * 100;
		if (calculate === 100) {
			return 'on-track';
		}
		if (calculate < 100 && calculate > 75) {
			return 'slightly-delayed';
		}
		if (calculate < 75 && calculate >= 50) {
			return 'at-risk';
		}
		if (calculate < 50) {
			return 'critical';
		}
		return 'on-track';
	};
	return (
		<>
			<div className="flex flex-wrap gap-3 mt-4 mb-2">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search groups or members..."
						value={''}
						onChange={(e) => console.log(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Risk Level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Risks</SelectItem>
						<SelectItem value="on-track">On Track</SelectItem>
						<SelectItem value="slightly-delayed">Slightly Delayed</SelectItem>
						<SelectItem value="at-risk">At Risk</SelectItem>
						<SelectItem value="critical">Critical</SelectItem>
					</SelectContent>
				</Select>
				<Select>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="Section" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Sections</SelectItem>
						{/* {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)} */}
					</SelectContent>
				</Select>
			</div>

			{/* Groups Table */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<Users className="h-5 w-5" />
						Thesis/Capstone Groups ({filterProjects.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="max-h-[600px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Group</TableHead>
									<TableHead>Section</TableHead>

									<TableHead className="text-center">
										Current Document
									</TableHead>
									<TableHead className="text-center">Docs Submitted</TableHead>
									<TableHead className="text-center">Progress</TableHead>
									<TableHead className="text-center">On-time</TableHead>
									<TableHead className="text-center">Late</TableHead>
									<TableHead>Next Deadline</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filterProjects.map((g) => {
									const latestDocument = documents
										.filter(
											(docs) =>
												(studentIds(g).includes(docs.student_id) ||
													docs.student_id === g.group_leader.id) &&
												docs.status === 'passed',
										)
										.sort(
											(a, b) =>
												new Date(b.created_at).getTime() -
												new Date(a.created_at).getTime(),
										)
										.filter(
											(doc, index, arr) =>
												index ===
												arr.findIndex((d) => d.title_name === doc.title_name),
										);
									const ontimeDocuments = latestDocument.filter((doc) => {
										const getDeadline = filterDeadlines.find(
											(deadline) => deadline.document_title === doc.title_name,
										);
										return getDeadline?.deadline
											? isBefore(doc.passed_date, getDeadline.deadline) ||
													isEqual(doc.passed_date, getDeadline.deadline)
											: false;
									});
									const lateDocuments = latestDocument.filter((doc) => {
										const getDeadline = filterDeadlines.find(
											(deadline) => deadline.document_title === doc.title_name,
										);
										return getDeadline?.deadline
											? isAfter(doc.passed_date, getDeadline.deadline)
											: false;
									});
									const completedPercentage: number =
										(latestDocument.length / filterDeadlines.length) * 100;
									const passedDocumentsTitle = latestDocument.map(
										(document) => document.title_name,
									);
									const nextDeadline = deadlines.filter(
										(deadline) =>
											!passedDocumentsTitle.includes(deadline.document_title),
									);
									return (
										<TableRow key={g.id}>
											<TableCell>
												<div>
													<p className="font-medium text-sm">{g.title}</p>
													<p className="text-xs text-muted-foreground">
														{g.group_leader.name}
														{g.details.length > 0 ? ',' : ''}
														{g.details.map((d) => d.student.name).join(', ')}
													</p>
												</div>
											</TableCell>
											<TableCell className="text-sm">
												{g.group_leader.section}
											</TableCell>
											<TableCell
												className={cn(
													'text-center',
													latestDocument
														? 'text-white'
														: 'text-muted-foreground',
												)}
											>
												{latestDocument.length > 0
													? latestDocument[0].title_name
													: 'No Document Uploaded'}
											</TableCell>
											<TableCell className="text-center">
												<Badge
													variant="outline"
													className={getRiskColor(
														getRisklevel(
															latestDocument.length,
															filterDeadlines.length,
														),
													)}
												>
													{latestDocument.length}/{filterDeadlines.length}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Progress
														value={completedPercentage}
														className="w-16 h-2"
													/>
													<span className="text-xs">
														{isNaN(completedPercentage)
															? '0'
															: completedPercentage}
														%
													</span>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<span className="text-xs text-green-500 font-medium">
													{ontimeDocuments.length}
												</span>
											</TableCell>
											<TableCell className="text-center">
												{lateDocuments.length > 0 ? (
													<Badge variant="destructive" className="text-xs">
														{lateDocuments.length}
													</Badge>
												) : (
													<span className="text-xs text-muted-foreground">
														0
													</span>
												)}
											</TableCell>
											<TableCell className="text-xs text-muted-foreground">
												{nextDeadline.length > 0
													? format(nextDeadline[0].deadline, 'MMM dd, yyyy')
													: 'No Document Uploaded'}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													// onClick={() => setSelectedGroup(g)}
												>
													<ChevronRight className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>
		</>
	);
};

export default GroupsComponent;
