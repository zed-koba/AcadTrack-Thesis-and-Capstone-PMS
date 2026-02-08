import { apiUrl } from '@/components/Routes/http';
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
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { AdviserDeleteProps } from '../interface/adviser';

const AdviserDelete = ({
	open,
	setOpen,
	adviser_id,
	onSuccess,
}: AdviserDeleteProps) => {
	const [loading, setLoading] = useState(false);
	const handleDelete = async () => {
		if (!adviser_id) return;
		setLoading(true);
		try {
			const res = await fetch(`${apiUrl}/advisers/delete/${adviser_id}`, {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message))
				);
				return;
			} else if (result.status == 500) {
				toast.error(result.message);
				console.log(result.error);
				return;
			}
			if (!res.ok) {
				toast.error('Failed to delete the adviser');
				return;
			}
			if (result.status == 200) {
				toast.success(result.message);
				console.log(result);
				setOpen(false);
				onSuccess?.();
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
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							student and remove your data from the servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-600 cursor-pointer text-white hover:bg-red-600/80"
							disabled={loading}
							onClick={handleDelete}
						>
							{loading ? <Spinner /> : <Trash />}
							{loading ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default AdviserDelete;
