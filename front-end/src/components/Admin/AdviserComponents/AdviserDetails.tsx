import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { Separator } from '@/components/ui/separator';
import { Calendar, Castle, Mail, Stethoscope, User } from 'lucide-react';
import { formatDate } from '@/components/functions/functions';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AdviserDetailsProps } from '../interface/adviser';
import { Badge } from '@/components/ui/badge';

const AdviserDetails = ({
	adviser,
	open,
	setOpen,
	department,
}: AdviserDetailsProps) => {
	const getStatusBadge = (status: string) => {
		return status === 'active' ? (
			<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
				Active
			</Badge>
		) : (
			<Badge
				variant="secondary"
				className="bg-muted text-muted-foreground mt-1"
			>
				Inactive
			</Badge>
		);
	};
	const personal_items = [
		{
			label: 'Name',
			icon: <User className="h-4 w-4" />,
			value: adviser?.name,
		},
		{
			label: 'Email',
			icon: <Mail className="h-4 w-4" />,
			value: adviser?.account.email,
		},
		{
			label: 'Department',
			icon: <Castle className="h-4 w-4" />,
			value: department?.name,
		},
		{
			label: 'Status',
			icon: <Stethoscope className="h-4 w-4" />,
			value: adviser ? getStatusBadge(adviser.status) : null,
		},
		{
			label: 'Created At',
			icon: <Calendar className="h-4 w-4" />,
			value: adviser ? formatDate(adviser.created_at) : null,
		},
		{
			label: 'Updated At',
			icon: <Calendar className="h-4 w-4" />,
			value: adviser ? formatDate(adviser.updated_at) : null,
		},
	];

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden text-white">
					<div className="p-6 pb-4">
						<DialogHeader>
							<DialogTitle>{adviser?.name}</DialogTitle>
							<DialogDescription>
								Overview and key information about the adviser.
							</DialogDescription>
						</DialogHeader>
					</div>

					<Separator />
					<ScrollArea className="max-h-[60vh]">
						<div className="grid gap-2 p-6">
							<p className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
								Personal Information
							</p>
							{personal_items.map((prod) => (
								<div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
									<div className="flex items-center gap-3 justify-center">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
											{prod.icon}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-muted-foreground ">
												{prod.label}
											</p>
											<div className="text-sm font-medium">{prod.value}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AdviserDetails;
