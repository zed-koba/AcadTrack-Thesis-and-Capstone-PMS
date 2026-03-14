import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import type { CancelAlertProps } from '../interface/consultation';
import { format } from 'date-fns';
import { to12HourTime } from '@/components/Adviser/interface/consultation';
import { apiStudentUrl } from '@/Routes/http';
import { toast } from 'sonner';
import { getUserToken } from '@/components/functions/functions';

const CancelAlertDialog = ({
	open,
	setOpen,
	selectedSchedule,
	project,
	refresh,
}: CancelAlertProps) => {
	const userToken = getUserToken();
	const updateStatus = async (status: string) => {
		try {
			const payLoad = {
				status: status,
			};
			const res = await fetch(
				`${apiStudentUrl}/${selectedSchedule.id}/weekly/update`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
					body: JSON.stringify(payLoad),
				},
			);

			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			} else if (result.status === 500) {
				console.log(result.error);
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
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent className="bg-zinc-900 border-zinc-800">
					<AlertDialogHeader>
						<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
							<AlertTriangle className="h-6 w-6 text-red-400" />
						</div>
						<AlertDialogTitle className="text-center text-zinc-100">
							Cancel Consultation?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center text-zinc-400">
							Are you sure you want to cancel your consultation with{' '}
							<span className="font-medium text-zinc-300">
								{project?.adviser.name}
							</span>{' '}
							on{' '}
							<span className="font-medium text-zinc-300">
								{format(selectedSchedule.date, 'MMMM d, yyyy')}
							</span>{' '}
							at{' '}
							<span className="font-medium text-zinc-300">
								{to12HourTime(selectedSchedule.start_time)} -{' '}
								{to12HourTime(selectedSchedule.end_time)}
							</span>
							?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex gap-2 flex-row sm:gap-2">
						<AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
							Keep Appointment
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500 text-white hover:bg-red-600"
							onClick={() => updateStatus('cancelled')}
						>
							Yes, Cancel
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default CancelAlertDialog;
