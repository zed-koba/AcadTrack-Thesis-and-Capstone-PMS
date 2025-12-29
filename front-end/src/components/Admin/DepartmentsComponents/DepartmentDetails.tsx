import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/components/functions/functions';
import type { DepartmentDetailsProps } from '../interface/department';

const DepartmentDetails = ({
	open,
	setOpen,
	department,
}: DepartmentDetailsProps) => {
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>{department.name}</DialogTitle>
						<DialogDescription>
							Overview and key information about the Department.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-base">
						<h2 className="text-lg font-semibold">Overview Details: </h2>
						<p>Name: {department.name}</p>
						<p className="capitalize">Code: {department.code}</p>
						<p>Description: {department.code}</p>
						<p>Status: {department.status}</p>
						<p>Created At: {formatDate(department.created_at)}</p>
						<p>Last Update: {formatDate(department.updated_at)}</p>

						<h2 className="text-lg font-semibold">Dependecies</h2>
						<p>Role: {department.roles_count}</p>
						<p>Program: {department.programs_count}</p>
						<p>Adviser: {department.advisers_count}</p>

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

export default DepartmentDetails;
