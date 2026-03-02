import { apiStudentUrl } from '@/Routes/http';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Forward } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
type DocumentPassProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	document_id: number | null;
	refresh?: () => void;
};
const DocumentPass = ({
	open,
	setOpen,
	document_id,
	refresh,
}: DocumentPassProps) => {
	const [loading, setLoading] = useState(false);
	const handlePass = async () => {
		if (!document_id) return;
		setLoading(true);
		try {
			const res = await fetch(
				`${apiStudentUrl}/documents/passed/${document_id}`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
				},
			);
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			} else if (result.status == 500) {
				toast.error(result.message);
				console.log(result.error);
				return;
			}
			if (!res.ok) {
				toast.error('Failed to pass the document');
				return;
			}
			if (result.status == 200) {
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
				<AlertDialogContent className="text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Submit Document to Instructor?</AlertDialogTitle>
						<AlertDialogDescription>
							You’re about to send this document directly to your instructor.
							<br />
							Once submitted, you may not be able to withdraw it. <br />
							<br />
							Please confirm that the content is final and ready for review. Do
							you want to proceed?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-emerald-500 cursor-pointer text-white hover:bg-emerald-500/80"
							disabled={loading}
							onClick={handlePass}
						>
							{loading ? <Spinner /> : <Forward />}
							{loading ? 'Passing Document...' : 'Pass Document'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default DocumentPass;
