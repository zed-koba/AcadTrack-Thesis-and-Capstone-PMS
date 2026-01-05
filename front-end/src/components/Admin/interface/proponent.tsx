export type ProponentsDetailsProps = {
	propsdetails_id?: number;
	name: string;
};
export type ProponentsProps = {
	id: number;
	proponents_id: string;
	academic_yr: string;
	semester: number;
	title: string;
	adviser: string;
	program: string;
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
	student_id: string;
	program_id: number;
};
export type ProponentsTableProps = {
	proponents: ProponentsProps[];
	advisers: AdvisersProponentProps[];
	programs: ProgramsProponentProps[];
	students: StudentsProponentsProps[];
	loading: boolean;
	refresh?: () => void;
};
export type ProponentAddProps = {
	programs: ProgramsProponentProps[];
	advisers: AdvisersProponentProps[];
	students: StudentsProponentsProps[];
	refresh?: () => void;
};

export type ProponentsAutoCompleteProps = {
	students: StudentsProponentsProps[];
	selectedStudentsIds: number[];
	onSelectionChange: (studentIds: number[]) => void;
	placeholder?: string;
	disabled?: boolean;
};
export type ProponentsEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
	onSuccess?: () => void;
};

export type ProponentsDetails = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
};
