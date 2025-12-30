import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/components/functions/functions';
import type { ProgramsDetailsProps } from '../interface/programs';

const ProgramDetails = ({
	open,
	setOpen,
	department,
	program,
}: ProgramsDetailsProps) => {
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>{program.name}</DialogTitle>
						<DialogDescription>
							Overview and key information about the role.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-base">
						<h2 className="text-lg font-semibold">Overview Details: </h2>
						<p>Name: {program.name}</p>
						<p>Code: {program.code}</p>
						<p>Description: {program.description}</p>
						<p>Department: {department?.name}</p>

						<p>Status: {program.status}</p>
						<p>Created At: {formatDate(program.created_at)}</p>
						<p>Last Update: {formatDate(program.updated_at)}</p>

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

export default ProgramDetails;
