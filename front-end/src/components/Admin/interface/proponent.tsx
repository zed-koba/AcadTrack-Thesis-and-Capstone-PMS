export type ProponentsDetailsProps = {
	propsdetails_id?: number;
	foreign_proponents_id?: string;
	student_id?: number;
	name: string;
};
export type ProponentsProps = {
	id: number;
	proponents_id: string;
	academic_yr: string;
	semester: number;
	title: string;
	adviser_id: number;
	program_id: number;
	created_at: string;
	updated_at: string;
	details: ProponentsDetailsProps[];
};

export type ProgramsProponentProps = {
	id: number;
	name: string;
	code: string;
};

export type AdvisersProponentProps = {
	id: number;
	name: string;
};

export type StudentsProponentsProps = {
	id: number;
	name: string;
	role_id: number;
	student_id: string;
	program_id: number;
};
export type RolesProponentsProps = {
	id: number;
	name: string;
};
export type ProponentsTableProps = {
	proponents: ProponentsProps[];
	advisers: AdvisersProponentProps[];
	programs: ProgramsProponentProps[];
	students: StudentsProponentsProps[];
	roles: RolesProponentsProps[];
	loading: boolean;
	refresh?: () => void;
};
export type ProponentAddProps = {
	programs: ProgramsProponentProps[];
	advisers: AdvisersProponentProps[];
	students: StudentsProponentsProps[];
	roles: RolesProponentsProps[];
	refresh?: () => void;
};

export type ProponentsAutoCompleteProps = {
	students: StudentsProponentsProps[];
	selectedStudentsIds: number[];
	initialStudents: number[];
	onSelectionChange: (studentIds: number[]) => void;
	onRemovedIdsChange?: (ids: number[]) => void;
	placeholder?: string;
	disabled?: boolean;
};
export type ProponentsEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
	programs: ProgramsProponentProps[];
	advisers: AdvisersProponentProps[];
	students: StudentsProponentsProps[];
	onSuccess?: () => void;
};

export type ProponentsDetails = {
	open: boolean;
	programs: ProgramsProponentProps | null;
	advisers: AdvisersProponentProps | null;
	roles: RolesProponentsProps[];
	students: StudentsProponentsProps[];
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
};
