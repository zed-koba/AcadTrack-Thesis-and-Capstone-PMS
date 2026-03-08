import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import type { TransferLeadershipProps } from '../interface/my-group';
import { useState } from 'react';
import { Crown, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiStudentUrl } from '@/Routes/http';
import { information, userToken } from '@/components/functions/functions';
import { toast } from 'sonner';

const TransferLeadership = ({
	members,
	open,
	setOpen,
	refresh,
}: TransferLeadershipProps) => {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const handleConfirm = async () => {
		const payLoad = {
			id: selectedId,
		};
		try {
			const res = await fetch(
				`${apiStudentUrl}/my-group/transfer/${information.id}`,
				{
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
					body: JSON.stringify(payLoad),
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
			<Dialog
				open={open}
				onOpenChange={(v) => {
					setOpen(v);
					if (!v) setSelectedId(null);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Crown className="h-5 w-5 text-primary" />
							Transfer Leadership
						</DialogTitle>
						<DialogDescription>
							Select a member to become the new group leader. You will become a
							regular member.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2 my-2 max-h-60 overflow-y-auto">
						{members.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No eligible members to transfer leadership to.
							</p>
						) : (
							members.map((member) => (
								<button
									key={member.student.id}
									onClick={() => setSelectedId(member.student.id)}
									className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
										selectedId === member.student.id
											? 'border-primary bg-primary/5 ring-1 ring-primary'
											: 'border-border hover:bg-muted/50'
									}`}
								>
									<div className="h-10 w-10 relative flex shrink-0 overflow-hidden rounded-full">
										<span
											className="text-sm bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-full 
                                    "
										>
											<User />
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">
											{member.student.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{member.student.account.email}
										</p>
									</div>

									<Badge variant="outline" className="text-[10px] shrink-0">
										{member.student.role
											? member.student.role.name
											: 'Not Assigned'}
									</Badge>
								</button>
							))
						)}
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false);
								setSelectedId(null);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleConfirm} disabled={!selectedId}>
							Transfer
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TransferLeadership;
