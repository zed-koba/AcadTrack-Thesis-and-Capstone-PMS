import { useEffect, useState } from 'react';
import type { ProponentsDetailsProps } from '../interface/proponent';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Trash } from 'lucide-react';
import { toast } from 'sonner';

type SelectedProponentProps = {
	open: boolean;
	setOpen: (open: ProponentsDetailsProps | null) => void;
	proponent: ProponentsDetailsProps;
	onUpdate: (updatedProponent: ProponentsDetailsProps) => void;
	onRemove: (id?: number) => void;
};
const ProponentUpdate = ({
	open,
	setOpen,
	proponent,
	onUpdate,
	onRemove,
}: SelectedProponentProps) => {
	const [name, setName] = useState(proponent.name);

	useEffect(() => {
		setName(proponent.name);
	}, [proponent]);

	const handleSave = () => {
		if (!name.trim()) {
			toast.error('Proponent name cannot be empty.');
			return;
		}
		if (name == 'Edit this proponent') {
			toast.error('Enter valid proponent name');
			return;
		}
		onUpdate({ ...proponent, name });
		setOpen(null);
	};

	const handleRemove = () => {
		onRemove(proponent.propsdetails_id);
		setOpen(null);
	};
	return (
		<Dialog open={open} onOpenChange={() => setOpen(null)}>
			<DialogContent className="text-white">
				<DialogHeader>
					<DialogTitle>{proponent.name}</DialogTitle>
				</DialogHeader>
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<div className="pt-2 flex justify-end gap-3">
					<Button
						variant="edit"
						onClick={handleSave}
						className="flex items-center gap-3 cursor-pointer"
					>
						Save <Check />
					</Button>
					<Button
						variant="destructive"
						onClick={handleRemove}
						className="flex items-center gap-3 cursor-pointer"
					>
						<Trash /> Remove Proponent
					</Button>
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={() => setOpen(null)}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProponentUpdate;
