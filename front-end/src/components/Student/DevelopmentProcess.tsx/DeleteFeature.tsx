import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import type { DeleteFeatureProps } from '../interface/developmentprocess';
import { apiStudentUrl } from '@/Routes/http';
import { toast } from 'sonner';
import { getUserToken } from '@/components/functions/functions';

const DeleteFeature = ({
	setSelectedId,
	selectedId,
	refresh,
}: DeleteFeatureProps) => {
	const userToken = getUserToken();
	const handleDelete = async () => {
		try {
			const res = await fetch(
				`${apiStudentUrl}/development-process/delete/${selectedId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
				},
			);
			const result = await res.json();
			if (!res.ok) {
				console.log('Failed to fetch data');
				return;
			}
			if (result.status === 200) {
				toast.success(result.message);
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<AlertDialog open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Feature</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently remove this feature from your project.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-red-500">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default DeleteFeature;
