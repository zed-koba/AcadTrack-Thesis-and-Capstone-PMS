import { cn } from '@/lib/utils';
import {
	CircleCheckBig,
	Clock,
	Eye,
	FileExclamationPoint,
	FileText,
} from 'lucide-react';
import type { DocumentDashboardProps } from '@/components/Student/interface/document';

const DocumentDashboard = ({ documents }: DocumentDashboardProps) => {
	const pendingLength = documents.filter((d) => d.status === 'pending').length;
	const underReviewLength = documents.filter(
		(d) => d.status === 'under review'
	).length;
	const needRevisionLength = documents.filter(
		(d) => d.status === 'need revision'
	).length;
	const approvedLength = documents.filter(
		(d) => d.status === 'approved'
	).length;
	const dashboard = [
		{
			color: 'bg-blue-500/20',
			icon: <FileText className="w-5 h-5 text-blue-500" />,
			value: documents.length,
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
			color: 'bg-green-500/10',
			icon: <CircleCheckBig className="w-5 h-5 text-green-500" />,
			value: approvedLength,
			label: 'Approved',
		},
	];
	return (
		<>
			<div className="flex flex-col gap-5 mt-5 w-full text-white">
				<section className="grid lg:grid-cols-5 sm:grid-cols-2 gap-2 mb-6">
					{dashboard.map((board) => (
						<div className="border bg-card rounded-md p-4 flex gap-3 justify-start items-start">
							<div
								className={cn(
									'flex justify-center items-center p-3 rounded-md',
									board.color
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
			</div>
		</>
	);
};

export default DocumentDashboard;
