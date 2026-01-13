import type { DocumentProps } from '@/components/Student/interface/document';

export type ViewDocumentsProps = {
	documents: DocumentProps[];
	setSelectedStudent: (selectedStudent: boolean) => void;
	refresh?: () => void;
};

export type StudentCardProps = {
	documents: DocumentProps[];
	setSelectedStudent: (selectedStudent: boolean) => void;
	setSelectedStudentDocuments: (
		selectedStudentDocuments: DocumentProps[]
	) => void;
	refresh?: () => void;
};
export type ViewDetailsProps = {
	selectedDocumentId: number;
	documents: DocumentProps[];
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
};

export type DocumentCommentsProps = {
	document_id: number;
	adviser_id: number;
	comment: string;
	comment_type: string;
	created_at: string;
	updated_at: string;
};
