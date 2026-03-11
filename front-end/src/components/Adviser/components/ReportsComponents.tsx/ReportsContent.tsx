import { Label } from '@/components/ui/label';
import type { ReportsProps } from '../../interface/reports';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { statusColor, studentIds } from '@/components/functions/functions';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
	Bar,
	Pie,
	BarChart,
	PieChart,
	Cell,
	LineChart,
	Line,
} from 'recharts';
import { differenceInMinutes, format, parse } from 'date-fns';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { to12HourTime } from '../../interface/consultation';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

const tooltipStyle = {
	backgroundColor: 'var(--popover)',
	border: '1px solid var(--border)',
	borderRadius: '8px',
	color: 'var(--popover-foreground)',
};
const PIE_COLORS = [
	'hsl(142, 71%, 45%)',
	'hsl(48, 96%, 53%)',
	'hsl(0, 84%, 60%)',
];
type MonthlyConsultation = {
	month: string;
	totalConsultation: number;
	totalCompletedConsultation: number;
	totalCancelledConsultation: number;
};
const ReportsContent = ({
	deadlines,
	documents,
	weeklies,
	projects,
}: ReportsProps) => {
	const [selectedId, setSelectedId] = useState<number | undefined>(
		projects.length > 0 ? projects[0].id : undefined,
	);
	const project = projects.find((p) => p.id === selectedId);
	const studentIdsArray = studentIds(project);

	const filteredWeeklies = project
		? weeklies.filter((w) => studentIdsArray.includes(w.student_id))
		: [];
	const filterDeadlines = deadlines.filter(
		(deadline) =>
			deadline.instructor_id === project?.group_leader.instructor_id,
	);
	const filterDocuments = documents.filter((doc) =>
		studentIdsArray.includes(doc.student_id),
	);
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
	const getDocumentData = useMemo(() => {
		return documentsGrouped.map((doc) => {
			const findDeadline = filterDeadlines.find(
				(deadline) => deadline.document_title === doc.title_name,
			);
			const submitted = documentsGrouped.filter((doc) =>
				doc.versions.length > 0
					? doc.versions[0].status === 'passed' &&
					findDeadline?.document_title === doc.versions[0].title_name
					: doc.status === 'passed' &&
					findDeadline?.document_title === doc.title_name,
			).length;

			const approved = documentsGrouped.filter((doc) =>
				doc.versions.length > 0
					? (doc.versions[0].status === 'passed' ||
						doc.versions[0].status === 'approved') &&
					findDeadline?.document_title === doc.versions[0].title_name
					: (doc.status === 'passed' || doc.status === 'approved') &&
					findDeadline?.document_title === doc.title_name,
			).length;

			const totalRevision = doc.versions.length;

			return {
				title_name: doc.title_name,
				submitted,
				approved,
				totalRevision,
			};
		});
	}, [filterDeadlines, documentsGrouped]);
	console.log(documentsGrouped);
	const getDeadlinesData = useMemo(() => {
		const totalOnTime = documentsGrouped.filter((doc) => {
			const findDeadline = filterDeadlines.find(
				(deadline) => deadline.document_title === doc.title_name,
			);

			if (!findDeadline || !doc.passed_date) return false;

			return new Date(doc.passed_date) <= new Date(findDeadline.deadline);
		}).length;
		const totalLate = documentsGrouped.filter((doc) => {
			const findDeadline = filterDeadlines.find(
				(deadline) => deadline.document_title === doc.title_name,
			);

			if (!findDeadline || !doc.passed_date) return false;

			return new Date(doc.passed_date) > new Date(findDeadline.deadline);
		}).length;
		return [
			{ name: 'On time', value: totalOnTime },
			{ name: 'Late', value: totalLate },
		];
	}, [filterDeadlines, documentsGrouped]);
	const consultationChartData = useMemo(() => {
		const monthly = filteredWeeklies.reduce<
			Record<string, MonthlyConsultation>
		>((acc, weekly) => {
			const month = format(new Date(weekly.date), 'MMM yyyy');

			if (!acc[month]) {
				acc[month] = {
					month,
					totalConsultation: 0,
					totalCompletedConsultation: 0,
					totalCancelledConsultation: 0,
				};
			}

			acc[month].totalConsultation++;

			if (weekly.status === 'completed')
				acc[month].totalCompletedConsultation++;
			if (weekly.status === 'cancelled')
				acc[month].totalCancelledConsultation++;

			return acc;
		}, {});

		return Object.values(monthly);
	}, [filteredWeeklies]);
	if (projects.length === 0) {
		return (
			<>
				<div className="flex flex-col justify-center items-center opacity-50 h-full">
					<BookOpen className="h-24 w-24 text-muted-foreground" />
					<p className="text-mb text-muted-foreground font-medium">
						There's not yet assigned thesis or capstone group in your advisory.
					</p>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="mt-4 flex gap-2">
				<Label>Thesis/Capstone Groups: </Label>
				<Select
					value={String(selectedId)}
					onValueChange={(v) => setSelectedId(Number(v))}
				>
					<SelectTrigger className="w-[400px]">
						<SelectValue placeholder="Select a student project" />
					</SelectTrigger>
					<SelectContent>
						{projects.map((p) => (
							<SelectItem key={p.id} value={String(p.id)}>
								{p.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-lg">Documents</CardTitle>
						<CardDescription>Submissions and approvals</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={getDocumentData}>
									<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
									<XAxis
										dataKey="title_name"
										tick={{
											fill: 'var(--muted-foreground)',
											fontSize: 11,
										}}
									/>
									<YAxis tick={{ fill: 'var(--muted-foreground)' }} />
									<Tooltip contentStyle={tooltipStyle} />
									<Legend />
									<Bar
										dataKey="submitted"
										fill="hsl(217, 91%, 60%)"
										name="Submitted"
										radius={[2, 2, 0, 0]}
									/>
									<Bar
										dataKey="approved"
										fill="hsl(142, 71%, 45%)"
										name="Approved"
										radius={[2, 2, 0, 0]}
									/>
									<Bar
										dataKey="totalRevision"
										fill="hsl(0, 84%, 60%)"
										name="Total Revision"
										radius={[2, 2, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-lg">Deadline Compliance</CardTitle>
						<CardDescription>On-time vs late submissions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={getDeadlinesData}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={100}
										paddingAngle={5}
										dataKey="value"
										label={({ name, value }) => `${name}: ${value}`}
									>
										{getDeadlinesData.map((_, i) => (
											<Cell key={i} fill={PIE_COLORS[i]} />
										))}
									</Pie>
									<Tooltip contentStyle={tooltipStyle} />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="flex justify-center gap-6 mt-2">
							{getDeadlinesData.map((item, i) => (
								<div key={item.name} className="flex items-center gap-2">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: PIE_COLORS[i] }}
									/>
									<span className="text-sm text-muted-foreground">
										{item.name} ({item.value})
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-1  gap-4 mt-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-lg">
							Monthly Consultation Details
						</CardTitle>
						<CardDescription>Completed and scheduled sessions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={consultationChartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
									<XAxis
										dataKey="month"
										tick={{ fill: 'var(--muted-foreground)' }}
									/>
									<YAxis tick={{ fill: 'var(--muted-foreground)' }} />
									<Tooltip contentStyle={tooltipStyle} />
									<Legend />
									<Line
										type="monotone"
										dataKey="totalConsultation"
										stroke="var(--primary)"
										strokeWidth={2}
										name="Total Consultation"
									/>
									<Line
										type="monotone"
										dataKey="totalCompletedConsultation"
										stroke="hsl(142, 71%, 45%)"
										strokeWidth={2}
										name="Completed"
									/>
									<Line
										type="monotone"
										dataKey="totalCancelledConsultation"
										stroke="hsl(262, 83%, 58%)"
										strokeWidth={2}
										name="Cancelled"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
			<Card className="mt-4">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-lg">Consultation Session Logs</CardTitle>
						<CardDescription>
							Detailed record of all consultation sessions with notes and
							outcomes
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date & Time</TableHead>
								<TableHead className="text-center">Duration</TableHead>
								<TableHead className="text-center">Status</TableHead>
								<TableHead>Agenda</TableHead>
								<TableHead>Notes / Remarks</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredWeeklies.map((log) => (
								<TableRow key={log.id}>
									<TableCell className="text-sm">
										<div>{log.date}</div>
										<div className="text-xs text-muted-foreground">
											{to12HourTime(log.start_time)}
										</div>
									</TableCell>
									<TableCell className="text-center text-sm">
										{differenceInMinutes(
											parse(
												log.actual_end ?? log.end_time,
												'HH:mm:ss',
												new Date(),
											),
											parse(
												log.actual_start ?? log.start_time,
												'HH:mm:ss',
												new Date(),
											),
										)}{' '}
										min
									</TableCell>
									<TableCell className="text-center">
										<Badge className={`${statusColor[log.status]} capitalize`}>
											{log.status}
										</Badge>
									</TableCell>
									<TableCell className="text-sm max-w-[200px]">
										{log.purpose}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground max-w-[250px]">
										{log.feedback}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	);
};

export default ReportsContent;
