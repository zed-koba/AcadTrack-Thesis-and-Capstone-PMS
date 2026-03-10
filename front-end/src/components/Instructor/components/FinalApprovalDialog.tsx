import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, FileText, Users } from 'lucide-react';
import type { ArchivingPendingProps } from '../interface/archiving';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { apiInstructorUrl } from '@/Routes/http';
import { getUserToken } from '@/components/functions/functions';

type FinalApprovalProps = {
	document: ArchivingPendingProps;
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
};
const FinalApprovalDialog = ({
	document,
	open,
	setOpen,
	refresh,
}: FinalApprovalProps) => {
	const userToken = getUserToken();
	const [loading, setLoading] = useState(false);
	const handleConfirm = async () => {
		setLoading(true);
		try {
			const payLoad = {
				foreign_proponents_id: document.student.project.proponents_id,
				title_name: document.title_name,
				original_name: document.original_name,
				stored_name: document.stored_name,
				path: document.path,
				mime_type: document.mime_type,
				size: document.size,
				version: document.version,
				passed_date: document.passed_date,
			};

			const res = await fetch(`${apiInstructorUrl}/archiving/add`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Accepts: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
				body: JSON.stringify(payLoad),
			});
			const result = await res.json();
			if (result.status === 422) {
				toast.error('Failed to archive');
				console.log(payLoad);
				console.log(result.errors);
				return;
			}
			if (result.status === 500) {
				toast.error('Failed to archive');
				console.log(result.error);
				return;
			}
			if (!res.ok) throw new Error('Failed to fetch comments');
			if (result.status === 201) {
				toast.success(result.message);
				setOpen(false);
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
		toast.success('Sucessfully archived');
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5 text-primary" />
							Final Approval Confirmation
						</DialogTitle>
						<DialogDescription>
							Review and confirm this adviser-approved document for archiving.
							Once archived, it becomes a permanent institutional record.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{/* Document Info */}
						<div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
							<div className="flex items-start gap-3">
								<FileText className="h-5 w-5 text-primary mt-0.5" />
								<div className="flex-1">
									<p className="font-semibold text-foreground">
										{document.title_name}
									</p>
								</div>
								<Badge variant="secondary">v{document.version}</Badge>
							</div>

							<Separator />

							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<p className="text-muted-foreground">Group</p>
									<p className="font-medium text-foreground">
										{document.student.project.title}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Program</p>
									<p className="font-medium text-foreground">
										{document.student.program.code}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Adviser Approved By</p>
									<p className="font-medium text-foreground">
										{document.student.project.adviser.name}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Approved Date</p>
									<p className="font-medium text-foreground">
										{format(new Date(document.passed_date), 'yyyy-MM-dd')}
									</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-center gap-2">
								<Users className="h-4 w-4 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									{document.student.project.details
										.map((student) => student.student.name)
										.filter(Boolean)
										.join(', ')}
								</p>
							</div>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button onClick={handleConfirm} disabled={loading}>
							{loading ? ' ' : <CheckCircle2 className="h-4 w-4 mr-1" />}
							{loading ? 'Archiving....' : 'Confirm Final & Archive'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default FinalApprovalDialog;
