export type AdviserProps = {
	id: number;
	name: string;
	first_name: string;
	last_name: string;
	suffix: string;
	contact_number: string;
	department_id: number;
	status: string;
	duration: number;
	created_at: string;
	updated_at: string;
	account: {
		id: number;
		email: string;
	};
	department: {
		id: number;
		name: string;
		code: string;
	};
};
export type AdviserDetailsProps = {
	adviser: AdviserProps | null;
	open: boolean;
	setOpen: (open: boolean) => void;
	department: DepartmentAdviserProps | null;
};
export type DepartmentAdviserProps = {
	id: number;
	name: string;
	code: string;
};

export type AdviserAddProps = {
	departments: DepartmentAdviserProps[];
	onSuccess?: () => void;
};

export type AdviserEditProps = {
	open: boolean;
	departments: DepartmentAdviserProps[];
	setOpen: (open: boolean) => void;
	adviser: AdviserProps;
	onSuccess?: () => void;
};

export type AdviserDashboardProps = {
	advisers?: AdviserProps[];
};

export type AdvisersTableProps = {
	advisers: AdviserProps[];
	departments: DepartmentAdviserProps[];
	loading: boolean;
	refresh: () => void;
};
export type AdviserDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	adviser_id: number;
	onSuccess?: () => void;
};
export const NAME_SUFFIX = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

type ParsedName = {
	first_name: string;
	last_name: string;
	suffix?: string;
};

export function parseName(fullName: string): ParsedName {
	const parts = fullName.trim().split(/\s+/);

	if (parts.length < 2) {
		throw new Error('Invalid full name');
	}

	const lastPart = parts[parts.length - 1];

	if (NAME_SUFFIX.includes(lastPart)) {
		return {
			first_name: parts.slice(0, parts.length - 2).join(' '),
			last_name: parts[parts.length - 2],
			suffix: lastPart,
		};
	}

	return {
		first_name: parts.slice(0, parts.length - 1).join(' '),
		last_name: lastPart,
		suffix: 'none',
	};
}
