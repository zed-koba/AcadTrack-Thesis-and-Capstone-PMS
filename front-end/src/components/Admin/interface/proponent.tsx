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
	title: string;
	adviser_id: number;
	created_at: string;
	updated_at: string;
	details: ProponentsDetailsProps[];
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
	students: StudentsProponentsProps[];
	roles: RolesProponentsProps[];
	loading: boolean;
	refresh?: () => void;
};
export type ProponentAddProps = {
	proponents: ProponentsProps[];
	advisers: AdvisersProponentProps[];
	students: StudentsProponentsProps[];
	roles: RolesProponentsProps[];
	refresh?: () => void;
};

export type ProponentsAutoCompleteProps = {
	students: StudentsProponentsProps[];
	proponents: ProponentsProps[];
	selectedStudentsIds: number[];
	initialStudents: number[];
	roles: RolesProponentsProps[];
	onSelectionChange: (studentIds: number[]) => void;
	onRemovedIdsChange?: (ids: number[]) => void;
	placeholder?: string;
	disabled?: boolean;
};
export type ProponentsEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
	proponents: ProponentsProps[];
	roles: RolesProponentsProps[];
	advisers: AdvisersProponentProps[];
	students: StudentsProponentsProps[];
	onSuccess?: () => void;
};

export type ProponentsDetails = {
	open: boolean;
	advisers: AdvisersProponentProps | null;
	roles: RolesProponentsProps[];
	students: StudentsProponentsProps[];
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
};
