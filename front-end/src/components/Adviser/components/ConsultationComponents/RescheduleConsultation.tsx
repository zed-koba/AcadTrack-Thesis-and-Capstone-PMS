import {
	formatTimeDisplay,
	getInformation,
	getUserToken,
} from '@/components/functions/functions';
import {
	autoRescheduleConsultation,
	type AdviserAvailability,
	type CalendarConsultation,
} from '@/components/functions/greedyAlgorithmn';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { apiStudentUrl } from '@/Routes/http';
import { format } from 'date-fns';
import { Check, XCircle } from 'lucide-react';
import { toast } from 'sonner';
type RescheduleConsultation = {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedSchedule: CalendarConsultation;
	adviserAvailability: AdviserAvailability[];
	consultations: CalendarConsultation[];
	refresh?: () => void;
};
const RescheduleConsultation = ({
	open,
	setOpen,
	selectedSchedule,
	adviserAvailability,
	consultations,
	refresh,
}: RescheduleConsultation) => {
	const autoReschedule = autoRescheduleConsultation(
		selectedSchedule,
		consultations,
		adviserAvailability,
	);
	const userToken = getUserToken();
	const information = getInformation();

	const handleSubmit = async () => {
		const payLoad = {
			adviser_id: information.id,
			adviser_name: information.name,
			student_id: selectedSchedule.student_id,
			date: autoReschedule ? format(autoReschedule.date, 'yyyy-MM-dd') : '',
			start_time: autoReschedule?.startTime.slice(0, 5),
			end_time: autoReschedule?.endTime.slice(0, 5),
			purpose: 'Reschedule',
			project_name: selectedSchedule.project_name,
			reschedule: true,
			project_id: selectedSchedule.project_id,
		};

		try {
			const res = await fetch(`${apiStudentUrl}/weekly/add`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
				body: JSON.stringify(payLoad),
			});
			const result = await res.json();

			if (result.status === 500) {
				toast.error(result.message);
				console.log(result.error);
				return;
			}

			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => {
						toast.error(message);
					}),
				);

				return;
			}

			if (!res.ok) {
				console.log(result.status);
				console.log('Failed to fetch data ' + JSON.stringify(payLoad));
				return;
			}

			if (result.status === 201 || result.status === 200) {
				toast.success(result.message);
				refresh?.();
				setOpen(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[520px] bg-card border-border">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							Rescheduling
						</DialogTitle>
						<DialogDescription>
							The system found optimal replacement slots for the cancelled
							consultation
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{/* Cancelled consultation info */}
						<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
							<div className="flex items-center gap-2 text-sm text-red-400 mb-1">
								<XCircle className="h-4 w-4" />
								<span className="font-medium">Cancelled Consultation</span>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">Schedule:</div>
									<div className="text-xs text-muted-foreground">Date:</div>
								</div>
								<div className="text-right text-sm">
									<div className="text-muted-foreground line-through">
										{formatTimeDisplay(selectedSchedule.scheduledStart)} -{' '}
										{formatTimeDisplay(selectedSchedule.scheduledEnd)}
									</div>
									<div className="text-xs text-muted-foreground">
										{format(selectedSchedule.date, 'MMM d, yyyy')}
									</div>
								</div>
							</div>
						</div>
						<div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
							{autoReschedule ? (
								<>
									<div className="flex items-center gap-2 text-sm text-green-400 mb-1">
										<Check className="h-4 w-4" />
										<span className="font-medium">Suggested Reschedule</span>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Schedule:</div>
											<div className="text-xs text-muted-foreground">Date:</div>
										</div>
										<div className="text-right text-sm">
											<div className="text-white">
												{formatTimeDisplay(
													autoReschedule ? autoReschedule?.startTime : '',
												)}{' '}
												-{' '}
												{formatTimeDisplay(
													autoReschedule ? autoReschedule?.endTime : '',
												)}
											</div>
											<div className="text-xs text-muted-foreground">
												{format(
													autoReschedule ? autoReschedule.date : '',
													'MMM d, yyyy',
												)}
											</div>
										</div>
									</div>
								</>
							) : (
								<>
									<div className="flex items-center gap-2 text-sm text-green-400 mb-1">
										<Check className="h-4 w-4" />
										<span className="font-medium">
											All scheduled are booked, add another availability
										</span>
									</div>
								</>
							)}
						</div>
					</div>

					<DialogFooter className="gap-2 flex">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel Schedule
						</Button>
						<Button
							onClick={handleSubmit}
							variant="primary"
							className="cursor-pointer"
						>
							Reschedule
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default RescheduleConsultation;
