import type { ProponentsProps } from '@/components/Admin/interface/proponent';

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
	parent_document_id: number | null;
	version: number;
	chapter: number;
	created_at: string;
	updated_at: string;
	versions: DocumentProps[];
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
	projects: ProponentsProps[];
	refresh?: () => void;
};

export type DocumentCardProps = {
	documents: DocumentProps[];
};
export type DocumentDashboardProps = {
	documents: DocumentProps[];
};
