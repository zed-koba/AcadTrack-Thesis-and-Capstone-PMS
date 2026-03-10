import { cn } from '@/lib/utils';
import {
	BookOpen,
	CircleCheckBig,
	Clock,
	Eye,
	FileExclamationPoint,
	FileText,
	RotateCcw,
} from 'lucide-react';
import type { DocumentDashboardProps } from '../interface/document';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInformation } from '@/components/functions/functions';

const DocumentDashboard = ({ documents, project }: DocumentDashboardProps) => {
	const studentIds = project?.details.map((v) => v.student_id);
	const information = getInformation();
	const filterStudent = documents.filter(
		(d) =>
			studentIds?.includes(d.student_id) || d.student_id === information.id,
	);

	const pendingLength = filterStudent.filter(
		(d) => d.status === 'pending',
	).length;
	const underReviewLength = filterStudent.filter(
		(d) => d.status === 'under review',
	).length;
	const needRevisionLength = filterStudent.filter(
		(d) => d.status === 'need revision',
	).length;
	const approvedLength = filterStudent.filter(
		(d) => d.status === 'approved',
	).length;
	const revisedLength = filterStudent.filter(
		(d) => d.status === 'revised',
	).length;
	const dashboard = [
		{
			color: 'bg-blue-500/20',
			icon: <FileText className="w-5 h-5 text-blue-500" />,
			value: filterStudent.length,
			label: 'Total Documents',
		},
		{
			color: 'bg-amber-500/20',
			icon: <Clock className="w-5 h-5 text-amber-500" />,
			value: pendingLength,
			label: 'Pending',
		},
		{
			color: 'bg-success/20',
			icon: <Eye className="w-5 h-5 text-success" />,
			value: underReviewLength,
			label: 'Under Review',
		},
		{
			color: 'bg-red-500/20',
			icon: <FileExclamationPoint className="w-5 h-5 text-red-500" />,
			value: needRevisionLength,
			label: 'Need Revision',
		},
		{
			color: 'bg-teal-500/10',
			icon: <RotateCcw className="w-5 h-5 text-teal-500" />,
			value: revisedLength,
			label: 'Revised',
		},
		{
			color: 'bg-green-500/10',
			icon: <CircleCheckBig className="w-5 h-5 text-green-500" />,
			value: approvedLength,
			label: 'Approved',
		},
	];
	const memberCount = (project?.details?.length ?? 0) + 1;
	return (
		<>
			<div className="flex flex-col gap-3 mt-5 w-full text-white">
				<section className="grid lg:grid-cols-6 sm:grid-cols-2 gap-2">
					{dashboard.map((board) => (
						<div
							key={board.label}
							className="border bg-card rounded-md p-4 flex gap-3 justify-start items-start"
						>
							<div
								className={cn(
									'flex justify-center items-center p-3 rounded-md',
									board.color,
								)}
							>
								{board.icon}
							</div>
							<div className="grid grid-row-2">
								<p className="font-bold text-2xl ">{board.value}</p>
								<p className="text-xs font-regular text-muted-foreground">
									{board.label}
								</p>
							</div>
						</div>
					))}
				</section>
				<Card className="mb-6">
					<CardContent className="px-4 py-1">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-md bg-primary/10">
								<BookOpen className="h-6 w-6 text-primary" />
							</div>
							<div className="flex-1">
								<h2 className="font-semibold text-lg">{project?.title}</h2>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>
										Adviser:{' '}
										<strong className="text-white">
											{project?.adviser.name}
										</strong>
									</span>
									<span>•</span>
									<span>{project?.group_leader.program.name}</span>
									<span>•</span>
									<Badge variant="secondary">
										{memberCount} member
										{memberCount !== 1 ? 's' : ''}
									</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default DocumentDashboard;
