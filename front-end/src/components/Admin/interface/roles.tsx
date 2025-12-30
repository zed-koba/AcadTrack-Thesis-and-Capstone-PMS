export type RolesProps = {
	id: number;
	name: string;
	description: string;
	globalRole: number;
	assigned: number;
	department_id: number;
	status: string;
	created_at: string;
	updated_at: string;
};

export type DepartmentRolesProps = {
	id: number;
	name: string;
	code: string;
};

export type RolesAddProps = {
	departments: DepartmentRolesProps[];
	onSuccess?: () => void;
};
export type RolesEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	roles: RolesProps;
	onSuccess?: () => void;
};

export type RolesDetailsProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	roles: RolesProps;
};

export type RolesDashboardProps = {
	roles?: RolesProps[];
};

export type RolesTableProps = {
	roles: RolesProps[];
	departments: DepartmentRolesProps[];
	loading: boolean;
	refresh: () => void;
};
