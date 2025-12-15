export type StudentProps = {
	id: number;
	email: string;
	role: string;
	student_id: string;
	program: string;
	section: string;
	status: string;
	created_at: string;
	updated_at: string;
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
