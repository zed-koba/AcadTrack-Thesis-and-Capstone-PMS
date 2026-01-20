import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type {
	ProponentsDetailsProps,
	ProponentsProps,
} from '@/components/Admin/interface/proponent';
import type {
	CommentProps,
	DocumentProps,
} from '@/components/Student/interface/document';

export type ChapterDocumentsProps = {
	chapter: number;
	documents: DocumentProps[];
};
export type ViewDocumentsProps = {
	chapter: ChapterDocumentsProps;
	isExpanded: boolean;
	onToggle: () => void;
	onSelectDocument: (document: DocumentProps) => void;
	selectedDocument: DocumentProps | null;
	setProjectAdviser: (adviser: AdviserProps) => void;
	projectAdviser: AdviserProps | null;
	refresh?: () => void;
};

export type DocumentItemProps = {
	currentDocument: DocumentProps;
	projectAdviser: AdviserProps | null;
	onSelectDocument: (document: DocumentProps) => void;
	selectedDocument: DocumentProps | null;
	setProjectAdviser: (adviser: AdviserProps) => void;
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
		program: {
			id: number;
			name: string;
			code: string;
		};
	};
};
export type ProjectWithStatus = ProponentsDocumentsProps & { status?: string };
export type AdviserDocumentContentProps = {
	documents: DocumentProps[];
	projects: ProjectWithStatus[];
	refresh?: () => void;
	selectedDocument: DocumentProps | null;
	setSelectedDocument: (document: DocumentProps | null) => void;
	loading: boolean;
};

export type ProjectCollapseProps = {
	documents: DocumentProps[];
	project: ProjectWithStatus;
	isExpanded: boolean;
	expandedChapters: Set<number>;
	projectAdviser: AdviserProps;
	onStatusChange: (projectId: number, newStatus: string) => void;
	onToggle: () => void;
	onToggleChapter: (chapterId: number) => void;
	onSelectDocument: (document: DocumentProps) => void;
	selectedDocument: DocumentProps | null;
	setProjectAdviser: (adviser: AdviserProps) => void;
	refresh?: () => void;
};
export type ViewDetailsProps = {
	selectedDocumentId: number;
	document: DocumentProps;
	open: boolean;
	setOpen: (open: boolean) => void;
	projectAdviser: AdviserProps | null;
	refresh?: () => void;
	checkIfLatestVersion: boolean;
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
	adviser: AdviserProps | null;
	refresh?: () => void;
	loading: boolean;
	setSelectedDocument: (document: DocumentProps | null) => void;
};
