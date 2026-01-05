export type StudentProps = {
	id: number;
	student_id: string;
	role: string;
	mobile_num: string;
	program: string;
	section: string;
	semester: number;
	year_level: number;
	facebook_profile: string;
	thesis_title: string;
	name: string;
	department_id: number;
	created_at: string;
	updated_at: string;
};

export type DepartmentStudentsProps = {
	id: number;
	name: string;
	code: string;
};

export type RolesStudentsProps = {
	id: number;
	name: string;
	department_id: number;
};

export type ProgramsStudentsProps = {
	id: number;
	name: string;
	code: string;
	department_id: number;
};
export type StudentsTable = {
	students: StudentProps[];
	departments: DepartmentStudentsProps[];
	roles: RolesStudentsProps[];

	loading: boolean;
	refresh?: () => void;
};

export type StudentAdd = {
	programs: ProgramsStudentsProps[];
	departments: DepartmentStudentsProps[];
	roles: RolesStudentsProps[];
	onSuccess?: () => void;
};
export type StudentEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student: StudentProps;
	onSuccess?: () => void;
};

export type StudentDetailsProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student: StudentProps;
};

export type StudentDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	student_id: number | null;
	onSuccess?: () => void;
};
