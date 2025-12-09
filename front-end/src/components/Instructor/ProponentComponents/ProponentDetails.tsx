import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { ProponentsDetails } from '../interface/proponent';
import { Button } from '@/components/ui/button';

const ProponentDetails = ({ open, setOpen, proponent }: ProponentsDetails) => {
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white">
					<DialogHeader>
						<DialogTitle>{proponent.title}</DialogTitle>
						<DialogDescription>
							Overview and key information about this thesis project.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-base">
						<h2 className="text-lg">Overview Details: </h2>
						<p>Academic Year: {proponent.academic_yr}</p>
						<p>
							Semester:{' '}
							{proponent.semester === 1 ? '1st Semester' : '2nd Semester'}
						</p>
						<p>Adviser: {proponent.adviser}</p>
						<p>Program: {proponent.program}</p>

						<h2 className="text-lg pt-2">Proponents: </h2>
						{proponent.details.map((p) => (
							<p>{p.name}</p>
						))}

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

export default ProponentDetails;
