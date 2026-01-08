import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { ProponentsDetails } from '../interface/proponent';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	CalendarDays,
	FileDigit,
	FileText,
	Megaphone,
	User,
} from 'lucide-react';
import { formatDate } from '@/components/functions/functions';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProponentDetails = ({
	advisers,
	students,
	roles,
	open,
	setOpen,
	proponent,
}: ProponentsDetails) => {
	const projectItems = [
		{
			title: 'Project Information',
			section: [
				{
					label: 'Proponent ID',
					icon: <FileDigit className="h-4 w-4" />,
					value: proponent.proponents_id,
				},

				{
					label: 'Academic Year',
					icon: <CalendarDays className="h-4 w-4" />,
					value: proponent.academic_yr,
				},
				{
					label: 'Adviser',
					icon: <Megaphone className="h-4 w-4" />,
					value: advisers?.name,
				},
				{
					label: 'Created At',
					icon: <Calendar className="h-4 w-4" />,
					value: formatDate(proponent.created_at),
				},
				{
					label: 'Updated At',
					icon: <Calendar className="h-4 w-4" />,
					value: formatDate(proponent.updated_at),
				},
			],
		},
	];
	const getRole = (id: number) => {
		const findRole = roles.find((d) => d.id === id);

		return findRole ?? { id: 0, name: 'Not Assigned' };
	};
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden text-white">
					<div className="p-6 pb-4">
						<DialogHeader>
							<DialogTitle>{proponent.title}</DialogTitle>
							<DialogDescription>
								Overview and key information about this thesis project.
							</DialogDescription>
						</DialogHeader>
					</div>

					<Separator />
					<ScrollArea className="max-h-[60vh]">
						<div className="grid gap-2 p-6">
							{projectItems.map((prod) => (
								<>
									<p className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
										{prod.title}
									</p>
									{prod.section.map((sec) => (
										<div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
											<div className="flex items-center gap-3 justify-center">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
													{sec.icon}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-xs font-medium text-muted-foreground ">
														{sec.label}
													</p>
													<div className="text-sm font-medium">{sec.value}</div>
												</div>
											</div>
										</div>
									))}
								</>
							))}
							<Separator />
							<p className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
								Members
							</p>
							{students.map((stud) => (
								<div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
									<div className="flex items-center gap-3 justify-center">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
											<User className="h-4 w-4" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium">{stud.name}</p>
											<div className="text-xs font-medium text-muted-foreground ">
												{getRole(stud.role_id).name}
											</div>
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

export default ProponentDetails;
