import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import { instructorId } from '@/components/functions/functions';
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
import { getRiskColor } from '../interface/deadlines';
import { Button } from '@/components/ui/button';

type GroupsComponentProps = {
	projects: ProponentsDocumentsProps[];
};
const GroupsComponent = ({ projects }: GroupsComponentProps) => {
	const filterProjects = projects.filter((project) =>
		project.details.some(
			(detail) => detail.student.instructor_id === instructorId,
		),
	);
	const performanceScore = 70;

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

									<TableHead className="text-center">Score</TableHead>
									<TableHead className="text-center">Risk</TableHead>
									<TableHead className="text-center">Missed</TableHead>
									<TableHead>Next Deadline</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filterProjects.map((g) => (
									<TableRow key={g.id}>
										<TableCell>
											<div>
												<p className="font-medium text-sm">{g.title}</p>
												<p className="text-xs text-muted-foreground">
													{g.details.map((d) => d.student.name).join(', ')}
												</p>
											</div>
										</TableCell>
										<TableCell className="text-sm">
											{g.details[0].student.section}
										</TableCell>
										<TableCell className="text-center">
											<span
												className={`font-bold text-sm ${performanceScore >= 70 ? 'text-green-500' : performanceScore >= 50 ? 'text-yellow-500' : 'text-destructive'}`}
											>
												{performanceScore}
											</span>
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className={getRiskColor('at-risk')}
											>
												{/* {g.riskLevel.replace('-', ' ')} */} At-risk
											</Badge>
										</TableCell>

										<TableCell className="text-center">
											{/* {g.missedDeadlines > 0 ? (
												<Badge variant="destructive" className="text-xs">
													{g.missedDeadlines}
												</Badge>
											) : (
												<span className="text-xs text-muted-foreground">0</span>
											)} */}
											<span className="text-xs text-muted-foreground">0</span>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{/* {format(g.nextDeadline, 'MMM dd, yyyy')} */} March 5,
											2026
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
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>
		</>
	);
};

export default GroupsComponent;
