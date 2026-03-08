import type {
	ProponentsDetailsProps,
	ProponentsProps,
} from '@/components/Admin/interface/proponent';

export type StudentDetails = {
	department_id: number;
	program_id: number;
	yearLevel: number;
	semester: number;
	mobile_num?: string;
	facebook_profile?: string;
};
export type ProjectMemberDetails = ProponentsDetailsProps & {
	student: {
		id: number;
		name: string;
		student_id: string;
	};
};
export type ProjectDetails = Omit<ProponentsProps, 'details'> & {
	details: ProjectMemberDetails[];
	adviser: {
		id: number;
		name: string;
	};
	group_leader: {
		id: number;
		name: string;
		student_id: string;
		instructor: {
			id: number;
			name: string;
		};
	};
};
