import type { ProponentsProps } from './proponent';
export type StudentProps = {
	id: number;
	student_id: string;
	role_id: number;
	mobile_num: string;
	program_id: number;
	section: string;
	semester: number;
	year_level: number;
	facebook_profile: string;
	instructor_id: number;
	name: string;
	department_id: number;
	created_at: string;
	updated_at: string;
	account: {
		id: number;
		email: string;
	};
};

export type DepartmentStudentsProps = {
	id: number;
	name: string;
	code: string;
};

export type RolesStudentsProps = {
	id: number;
	name: string;
	globalRole: number;
	department_id: number;
};

export type ProgramsStudentsProps = {
	id: number;
	name: string;
	code: string;
	department_id: number;
};
export type StudentsTableProps = {
	students: StudentProps[];
	departments: DepartmentStudentsProps[];
	programs: ProgramsStudentsProps[];
	roles: RolesStudentsProps[];
	instructors: InstructorStudentsProps[];
	proponents: ProponentsProps[];
	loading: boolean;
	refresh?: () => void;
};

export type InstructorStudentsProps = {
	id: number;
	name: string;
};

export type StudentAddProps = {
	programs: ProgramsStudentsProps[];
	departments: DepartmentStudentsProps[];
	roles: RolesStudentsProps[];
	instructors: InstructorStudentsProps[];
	onSuccess?: () => void;
};
export type StudentEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student: StudentProps;
	programs: ProgramsStudentsProps[];
	departments: DepartmentStudentsProps[];
	roles: RolesStudentsProps[];
	instructors: InstructorStudentsProps[];
	onSuccess?: () => void;
};

export type StudentDetailsProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student: StudentProps;
	role: RolesStudentsProps | null;
	program: ProgramsStudentsProps | null;
	department: DepartmentStudentsProps | null;
	instructor: InstructorStudentsProps | null;
	proponent: ProponentsProps | null;
};

export type StudentDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student_id: number | null;
	onSuccess?: () => void;
};
