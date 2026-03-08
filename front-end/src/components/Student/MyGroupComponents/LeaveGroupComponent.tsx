import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import type { LeaveGroupProps } from '../interface/my-group';
import { apiStudentUrl } from '@/Routes/http';
import { user, userToken } from '@/components/functions/functions';

const LeaveGroupComponent = ({
	open,
	setOpen,
	selectedId,
	refresh,
}: LeaveGroupProps) => {
	const handleDelete = async () => {
		try {
			const res = await fetch(
				`${apiStudentUrl}/my-group/leaveGroup/${selectedId}`,
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
				const updatedUser = {
					...user,
					new_user: 1,
				};
				localStorage.setItem('user', JSON.stringify(updatedUser));
				window.location.reload();
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave Group?</AlertDialogTitle>
						<AlertDialogDescription>
							You are about to leave. You will lose access to all group
							documents and consultations. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleDelete}
						>
							Leave Group
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default LeaveGroupComponent;
