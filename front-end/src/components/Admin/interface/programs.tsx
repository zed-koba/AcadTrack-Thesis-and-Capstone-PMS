import type { ProponentsProps } from './proponent';

export type ProgramsProps = {
	id: number;
	name: string;
	description: string;
	code: string;
	department_id: number;
	students_count: number;
	status: string;
	created_at: string;
	updated_at: string;
};

export type DepartmentProgramsProps = {
	id: number;
	name: string;
	code: string;
};

export type ProgramAddProps = {
	departments: DepartmentProgramsProps[];
	onSuccess?: () => void;
};

export type ProgramEditProps = {
	open: boolean;
	departments: DepartmentProgramsProps[];
	setOpen: (open: boolean) => void;
	program: ProgramsProps;
	onSuccess?: () => void;
};

export type ProgramsDetailsProps = {
	open: boolean;
	department: DepartmentProgramsProps | null;
	setOpen: (open: boolean) => void;
	program: ProgramsProps;
};

export type ProgramsDashboardProps = {
	programs?: ProgramsProps[];
};

export type ProgramsTableProps = {
	// proponents: ProponentsProps[];
	programs: ProgramsProps[];
	departments: DepartmentProgramsProps[];
	loading: boolean;
	refresh: () => void;
};
