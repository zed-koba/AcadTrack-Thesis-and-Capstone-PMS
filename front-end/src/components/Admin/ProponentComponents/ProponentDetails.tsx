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
	programs,
	students,
	roles,
	open,
	setOpen,
	proponent,
}: ProponentsDetails) => {
	const projectItems = [
		{
			label: 'Proponent ID',
			icon: <FileDigit className="h-4 w-4" />,
			value: proponent.title,
		},
		{
			label: 'Title',
			icon: <FileText className="h-4 w-4" />,
			value: proponent.title,
		},
		{
			label: 'Academic Year',
			icon: <CalendarDays className="h-4 w-4" />,
			value: proponent.academic_yr,
		},
		{
			label: 'Semester',
			icon: <Megaphone className="h-4 w-4" />,
			value: proponent.semester === 1 ? '1st Semester' : '2nd Semester',
		},
		{
			label: 'Program',
			icon: <Megaphone className="h-4 w-4" />,
			value: programs?.name,
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
	];
	const getRole = (id: number) => {
		const findRole = roles.find((d) => d.id === id);

		return findRole?.name;
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
							<p className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
								Project Information
							</p>
							{projectItems.map((prod) => (
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
											<p className="text-xs font-medium text-muted-foreground ">
												{getRole(stud.role_id)}
											</p>
											<div className="text-sm font-medium">{stud.name}</div>
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
