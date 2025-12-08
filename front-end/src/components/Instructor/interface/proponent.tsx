export type ProponentsDetailsProps = {
	propsdetails_id: number;
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

export type ProponentsEditProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	proponent: ProponentsProps;
	onSuccess?: () => void;
};
