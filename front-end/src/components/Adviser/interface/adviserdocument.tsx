import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type {
	ProponentsDetailsProps,
	ProponentsProps,
} from '@/components/Admin/interface/proponent';
import type { DocumentProps } from '@/components/Student/interface/document';

export type ChapterDocumentsProps = {
	chapter: number;
	documents: DocumentProps[];
};
export type ViewDocumentsProps = {
	chapter: ChapterDocumentsProps;
	isExpanded: boolean;
	onToggle: () => void;
	onSelectDocument: (document: DocumentProps) => void;
	refresh?: () => void;
};

export type DocumentItemProps = {
	currentDocument: DocumentProps;
	onSelectDocument: (document: DocumentProps) => void;
	refresh?: () => void;
};

export type ProponentsDocumentsProps = {
	id: number;
	proponents_id: string;
	academic_yr: string;
	title: string;
	adviser_id: number;
	created_at: string;
	updated_at: string;
	details: DetailsDocumentsProps[];
	adviser: AdviserProps;
};
export type DetailsDocumentsProps = {
	propsdetails_id?: number;
	foreign_proponents_id?: string;
	student_id?: number;
	name: string;
	student: {
		name: string;
		student_id: string;
		id: number;
	};
};

export type AdviserDocumentContentProps = {
	documents: DocumentProps[];
	projects: ProponentsDocumentsProps[];
	refresh?: () => void;
	selectedDocument: DocumentProps | null;
	setSelectedDocument: (document: DocumentProps | null) => void;
	loading: boolean;
};

export type ProjectCollapseProps = {
	documents: DocumentProps[];
	project: ProponentsDocumentsProps;
	isExpanded: boolean;
	expandedChapters: Set<number>;
	onToggle: () => void;
	onToggleChapter: (chapterId: number) => void;
	onSelectDocument: (document: DocumentProps) => void;
	refresh?: () => void;
};
export type ViewDetailsProps = {
	selectedDocumentId: number;
	documents: DocumentProps[];
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
};

export type CommentsProps = {
	document_id: number;
	adviser_id: number;
	comment: string;
	comment_type: string;
	created_at: string;
	updated_at: string;
};

export type DocumentCommentsProps = {
	document: DocumentProps | null;
	refresh?: () => void;
	loading: boolean;
};
