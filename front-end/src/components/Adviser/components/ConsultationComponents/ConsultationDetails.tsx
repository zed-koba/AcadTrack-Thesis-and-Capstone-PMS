import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, FileText, MessageSquare, User } from 'lucide-react';
import {
	formatTime,
	type ConsultationDialogProps,
} from '../../interface/consultation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { apiAdviserUrl } from '@/components/Routes/http';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const ConsultationDetails = ({
	open,
	weekly,
	setOpen,
	refresh,
}: ConsultationDialogProps) => {
	const [feedback, setFeedback] = useState('');
	if (!weekly) return null;

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'approved':
				return (
					<Badge className="bg-sky-500/20 text-sky-400 border-sky-500/50">
						Confirmed
					</Badge>
				);
			case 'pending':
				return (
					<Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
						Pending
					</Badge>
				);
			case 'completed':
				return (
					<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
						Completed
					</Badge>
				);
			case 'rejected':
				return <Badge variant="destructive">Cancelled</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};
	const updateStatus = async (status: string) => {
		try {
			const payLoad = {
				status: status,
				feedback: feedback,
			};
			const res = await fetch(`${apiAdviserUrl}/${weekly.id}/weekly/update`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payLoad),
			});
			console.log(payLoad);
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message))
				);
				return;
			} else if (result.status === 500) {
				console.log(result.errors);
				return;
			}

			if (result.status === 200) {
				toast.success(result.message);
				setOpen(false);
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[500px] text-white">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<span>Consultation Details</span>
							{getStatusBadge(weekly.status)}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 py-4">
						<div className="grid w-full min-w-0 grid-cols-1 gap-4">
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Student</p>
									<p className="text-sm text-muted-foreground">
										{weekly.student.name}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Date</p>
									<p className="text-sm text-muted-foreground">
										{format(weekly.date, 'EEEE, MMMM d, yyyy')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Time</p>
									<p className="text-sm text-muted-foreground">
										{formatTime(weekly.start_time)} -{' '}
										{formatTime(weekly.end_time)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Purpose</p>
									<p className="text-sm text-muted-foreground">
										{weekly.purpose}
									</p>
								</div>
							</div>
							{weekly.status === 'approved' && (
								<div className="flex flex-row items-start gap-3">
									<MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
									<div className="w-full flex flex-col gap-2 min-w-0">
										<p className="text-sm font-medium">Consultation Summary</p>
										<Textarea
											id="feedback"
											onChange={(e) => setFeedback(e.target.value)}
											autoComplete="off"
											placeholder="Provide a brief conclusion of the consultation, including recommendations and required actions..."
											className="w-full resize-none"
										/>
									</div>
								</div>
							)}
						</div>

						{weekly.status === 'pending' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('approved');
										setOpen(false);
									}}
									variant="primary"
									className="flex-1 "
								>
									Approve
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										updateStatus('rejected');
										setOpen(false);
									}}
									className="flex-1"
								>
									Reject
								</Button>
							</div>
						)}
						{weekly.status === 'rejected' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {}}
									variant="outline"
									className="flex-1 bg-amber-600 hover:bg-amber-600/80"
								>
									Re-schedule
								</Button>
							</div>
						)}

						{weekly.status === 'approved' && (
							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={() => {
										updateStatus('completed');
										setOpen(false);
									}}
									className="flex-1 bg-emerald-500 hover:bg-emerald-500/80"
									variant="outline"
								>
									Mark Completed
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										updateStatus('rejected');
										setOpen(false);
									}}
									className="flex-1"
								>
									Cancel Consultation
								</Button>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ConsultationDetails;
