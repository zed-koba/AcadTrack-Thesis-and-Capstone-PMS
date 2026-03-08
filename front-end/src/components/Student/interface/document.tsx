import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';

export type DocumentProps = {
	id: number;
	student_id: number;
	original_name: string;
	stored_name: string;
	title_name: string;
	status: string;
	path: string;
	mime_type: string;
	size: number;
	parent_document_id: number | null;
	version: number;
	passed_date: Date;
	created_at: string;
	updated_at: string;
	versions: DocumentProps[];
	comments: CommentProps[];
	student: {
		id: number;
		name: string;
		student_id: string;
		proponent_detail: {
			foreign_proponents_id: string;
		};
		project: {
			proponents_id: string;
		};
	};
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
	deadlines: Deadlines[];
};
export type DocumentRevisionProps = {
	document: DocumentProps;
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
	setSubmitRevision: (submitRevision: boolean) => void;
};

export type DocumentContentProps = {
	documents: DocumentProps[];
	project: ProponentsDocumentsProps | null;
	deadlines: Deadlines[];
	refresh?: () => void;
};

export type DocumentCardProps = {
	documents: DocumentProps[];
};
export type DocumentDashboardProps = {
	documents: DocumentProps[];
	project: ProponentsDocumentsProps | null;
};

export type DocumentItemProps = {
	currentDocument: DocumentProps;
	projectAdviser: AdviserProps | null;
	refresh?: () => void;
};
