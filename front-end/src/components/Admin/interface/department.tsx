export type DepartmentProps = {
	id: number;
	name: string;
	code: string;
	description: string;
	status: string;
	dependencies: string;
	created_at: string;
	updated_at: string;
	programs_count: number;
	roles_count: number;
	advisers_count: number;
};
export type DepartmentsDashboardProps = {
	departments?: DepartmentProps[];
};

export type DepartmentTableProps = {
	departments: DepartmentProps[];
	loading: boolean;
	refresh: () => void;
};

export type DepartmentEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	department: DepartmentProps;
	onSuccess?: () => void;
};

export type DepartmentDetailsProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	department: DepartmentProps;
};

export type DepartmentDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	department: DepartmentProps;
	onSuccess?: () => void;
};
