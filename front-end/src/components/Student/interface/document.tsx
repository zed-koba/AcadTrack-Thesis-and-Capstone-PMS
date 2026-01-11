export type DocumentProps = {
	id: number;
	student_id: number;
	original_name: string;
	stored_name: string;
	title_name: string;
	description: string;
	status: string;
	path: string;
	mime_type: string;
	created_at: string;
	updated_at: string;
	student: {
		name: string;
	};
};

export type DocumentUploadProps = {
	refresh?: () => void;
};

export type DocumentContentProps = {
	documents: DocumentProps[];
	refresh?: () => void;
};

export type DocumentCardProps = {
	documents: DocumentProps[];
};
export type DocumentDashboardProps = {
	documents: DocumentProps[];
};

export type DocumentViewDialogProps = {
	document: DocumentProps;
	open: boolean;
	setOpen: (open: boolean) => void;
};
