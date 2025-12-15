import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { StudentDetailsProps } from '../interface/student';
import { formatDate } from '@/components/functions/functions';

const StudentDetails = ({ open, setOpen, student }: StudentDetailsProps) => {
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>{student.student_id}</DialogTitle>
						<DialogDescription>
							Overview and key information about this thesis project.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-base">
						<h2 className="text-lg">Overview Details: </h2>
						<p>Email: {student.email}</p>
						<p>Program: {student.program}</p>
						<p>Section: {student.section}</p>
						<p>Status: {student.status}</p>
						<p>Created at: {formatDate(student.created_at)}</p>

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

export default StudentDetails;
