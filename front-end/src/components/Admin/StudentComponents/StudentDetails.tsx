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
	Briefcase,
	Building,
	Calendar,
	Castle,
	Facebook,
	FileText,
	FireExtinguisher,
	Phone,
	Pi,
	User,
} from 'lucide-react';
import { formatDate } from '@/components/functions/functions';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StudentDetailsProps } from '../interface/student';

const StudentDetails = ({
	student,
	open,
	setOpen,
	role,
	program,
	department,
}: StudentDetailsProps) => {
	const personal_items = [
		{
			label: 'Name',
			icon: <User className="h-4 w-4" />,
			value: student.name,
		},
		{
			label: 'Mobile Number',
			icon: <Phone className="h-4 w-4" />,
			value: student.mobile_num === null ? 'Not Assigned' : student.mobile_num,
		},
		{
			label: 'Thesis Title',
			icon: <FileText className="h-4 w-4" />,
			value: student.thesis_title,
		},
		{
			label: 'Facebook Profile',
			icon: <Facebook className="h-4 w-4" />,
			value:
				student.facebook_profile === null
					? 'Not Assigned'
					: student.facebook_profile,
		},
		{
			label: 'Created At',
			icon: <Calendar className="h-4 w-4" />,
			value: formatDate(student.created_at),
		},
		{
			label: 'Updated At',
			icon: <Calendar className="h-4 w-4" />,
			value: formatDate(student.updated_at),
		},
	];

	const eduation_info = [
		{
			label: 'Role',
			icon: <Briefcase className="h-4 w-4" />,
			value: role?.name,
		},
		{
			label: 'Department',
			icon: <Castle className="h-4 w-4" />,
			value: department?.name,
		},

		{
			label: 'Program',
			icon: <Pi className="h-4 w-4" />,
			value: program?.name,
		},
		{
			label: 'Section',
			icon: <Building className="h-4 w-4" />,
			value: student.section,
		},
		{
			label: 'Year Level',
			icon: <FireExtinguisher className="h-4 w-4" />,
			value: student.year_level === 3 ? '3rd Year' : '4th Year',
		},
	];
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden text-white">
					<div className="p-6 pb-4">
						<DialogHeader>
							<DialogTitle>{student.student_id}</DialogTitle>
							<DialogDescription>
								Overview and key information about the student.
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
							<Separator className="mt-2 mb-2" />
							<p className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
								Education Information
							</p>
							{eduation_info.map((edu) => (
								<div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
									<div className="flex items-center gap-3 justify-center">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
											{edu.icon}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-muted-foreground ">
												{edu.label}
											</p>
											<div className="text-sm font-medium">{edu.value}</div>
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

export default StudentDetails;
