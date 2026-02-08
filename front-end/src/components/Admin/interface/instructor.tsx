export type InstructorProps = {
	id: number;
	name: string;
	first_name: string;
	last_name: string;
	suffix: string;
	contact_number: string;
	department_id: number;
	status: string;
	created_at: string;
	updated_at: string;
	account: {
		id: number;
		email: string;
	};
};
export type InstructorDetailsProps = {
	instructor: InstructorProps | null;
	open: boolean;
	setOpen: (open: boolean) => void;
	department: DepartmentInstructorProps | null;
};
export type DepartmentInstructorProps = {
	id: number;
	name: string;
	code: string;
};

export type InstructorAddProps = {
	departments: DepartmentInstructorProps[];
	onSuccess?: () => void;
};

export type InstructorDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	instructor_id: number;
	onSuccess?: () => void;
};

export type InstructorEditProps = {
	open: boolean;
	departments: DepartmentInstructorProps[];
	setOpen: (open: boolean) => void;
	instructor: InstructorProps;
	onSuccess?: () => void;
};

export type InstructorDashboardProps = {
	instructors?: InstructorProps[];
};

export type InstructorTableProps = {
	instructors: InstructorProps[];
	departments: DepartmentInstructorProps[];
	loading: boolean;
	refresh: () => void;
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
