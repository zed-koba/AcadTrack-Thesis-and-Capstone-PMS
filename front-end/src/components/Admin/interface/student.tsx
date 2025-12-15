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
