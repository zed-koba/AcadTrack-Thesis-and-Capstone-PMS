import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityIcon, Bell, User2 } from 'lucide-react';
import type { DocumentProps } from '@/components/Student/interface/document';
import { formatDate } from '@/components/functions/functions';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import type { StudentCardProps } from '../../interface/adviserdocument';

const DocumentStudentCard = ({
	documents,
	setSelectedStudent,
	setSelectedStudentDocuments,
	refresh,
}: StudentCardProps) => {
	const [open, setOpen] = useState(false);
	const filterDocuments = documents.filter((d) => d.student_id === 1);
	const getPendingDocument = documents.filter(
		(d) => d.student_id === 1 && d.status === 'pending'
	).length;
	const getRevisionDocument = documents.filter(
		(d) => d.student_id === 1 && d.status === 'need revision'
	).length;
	const getApprovedDocument = documents.filter(
		(d) => d.student_id === 1 && d.status === 'approved'
	).length;
	const findStudent = documents.find((d) => d.student_id === 1);
	return (
		<>
			<Card className="hover:shadow-md transition-shadow">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-primary/10">
								<User2 className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-base">
									{findStudent?.student.name}
								</CardTitle>
								<p className="text-xs text-muted-foreground mt-1">
									{findStudent?.student.program.code} |{' '}
									{findStudent?.student.section}
								</p>
							</div>
						</div>
						{/* <div className="py-0.5 px-3 flex gap-1 items-center text-amber-500 bg-amber-500/20  rounded-full mt-1 border-amber-500/40 border">
							<Bell className="h-3 w-3" />
							<p className="text-xs font-medium capitalize">1 Notification</p>
						</div> */}
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground mb-4 line-clamp-2 grid grid-cols-2 gap-3">
						<div className="shadow-md bg-muted rounded-md p-2 flex items-center flex-col justify-start gap-0">
							<p className="text-2xl font-bold text-white">
								{filterDocuments.length}
							</p>
							<span className="text-xs font-regular text-muted-foreground text-center">
								Total Documents
							</span>
						</div>
						<div className="shadow-md bg-muted rounded-md p-2 flex items-center flex-col justify-start gap-0">
							<p className="text-2xl font-bold text-white">
								{getPendingDocument}
							</p>
							<span className="text-xs font-regular text-muted-foreground text-center">
								Pending Documents
							</span>
						</div>
						<div className="shadow-md bg-muted rounded-md p-2 flex items-center flex-col justify-start gap-0">
							<p className="text-2xl font-bold text-white">
								{getRevisionDocument}
							</p>
							<span className="text-xs font-regular text-muted-foreground text-center">
								Need Revision
							</span>
						</div>
						<div className="shadow-md bg-muted rounded-md p-2 flex items-center flex-col justify-start gap-0">
							<p className="text-2xl font-bold text-white">
								{getApprovedDocument}
							</p>
							<span className="text-xs font-regular text-muted-foreground text-center">
								Approved Documents
							</span>
						</div>
					</div>
					<Separator className="mb-2" />
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<ActivityIcon className="h-4 w-4" />
								Last Activity: Jan 09, 2026
							</span>
							<span className="flex items-center gap-1"></span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedStudent(false);
								setSelectedStudentDocuments(filterDocuments);
							}}
						>
							View Documents
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default DocumentStudentCard;
