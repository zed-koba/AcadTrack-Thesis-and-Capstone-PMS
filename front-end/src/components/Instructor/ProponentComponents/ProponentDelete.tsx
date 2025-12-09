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
import { toast } from 'react-toastify';

type ProponentDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent_id: number | null;
	onSuccess?: () => void;
};
const ProponentDelete = ({
	open,
	setOpen,
	proponent_id,
	onSuccess,
}: ProponentDeleteProps) => {
	const [loading, setLoading] = useState(false);
	const handleDelete = async () => {
		if (!proponent_id) return;
		setLoading(true);
		try {
			const res = await fetch(`${apiUrl}/proponents/delete/${proponent_id}`, {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});

			if (!res.ok) {
				toast.error('Failed to delete the proponent', { theme: 'colored' });
				return;
			}
			toast.success('Sucessfully deleted the proponent');
			setOpen(false);

			onSuccess?.();
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
							proponents and remove your data from the servers.
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

export default ProponentDelete;
