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
	size: number;
	parent_document_id: number;
	version: number;
	created_at: string;
	updated_at: string;
	student: {
		name: string;
		student_id: string;
		section: string;
		program: {
			name: string;
			code: string;
		};
		department: {
			name: string;
			code: string;
		};
		instructor: {
			name: string;
		};
		account: {
			email: string;
		};
		role: {
			name: string;
		};
		proponent_detail: {
			proponent: {
				title: string;
			};
		};
	};
	comments: CommentProps[];
};

export type CommentProps = {
	id: number;
	document_id: number;
	adviser_id: number;
	comment: string;
	comment_type: string;
	created_at: string;
	updated_at: string;
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
