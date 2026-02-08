import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/components/functions/functions';
import type { RolesDetailsProps } from '../interface/roles';

const RoleDetails = ({
	open,
	setOpen,
	department,
	role,
}: RolesDetailsProps) => {
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>{role.name}</DialogTitle>
						<DialogDescription>
							Overview and key information about the role.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-base">
						<h2 className="text-lg font-semibold">Overview Details: </h2>
						<p>Name: {role.name}</p>
						<p>Description: {role.description}</p>
						<p>
							Department: {role.globalRole ? 'Global Role' : department?.name}
						</p>
						<p>Assigned Students: {role.assigned}</p>
						<p>Status: {role.status}</p>
						<p>Created At: {formatDate(role.created_at)}</p>
						<p>Last Update: {formatDate(role.updated_at)}</p>

						<div className="flex justify-end pt-2 text-white gap-3">
							<Button
								type="button"
								variant="outline"
								className="cursor-pointer"
								onClick={() => setOpen(false)}
							>
								Close
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default RoleDetails;
