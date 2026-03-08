import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import type { DocumentProps } from '@/components/Student/interface/document';

export type ChapterDocumentsProps = {
	chapter: number;
	documents: DocumentProps[];
};
export type ViewDocumentsProps = {
	document: DocumentProps;
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
};

export type ProponentsDocumentsProps = Omit<ProponentsProps, 'details'> & {
	details: DetailsDocumentsProps[];
	adviser: AdviserProps;
	group_leader: {
		id: number;
		name: string;
		instructor_id: number;
		program_id: number;
		section: string;
		instructor: {
			id: number;
			name: string;
		};
		program: {
			id: number;
			name: string;
			code: string;
		};
		document: {
			id: number;
			title_name: string;
			status: string;
			approved_date: Date;
			passed_date: Date;
		}[];
	};
};
export type DetailsDocumentsProps = {
	propsdetails_id?: number;
	foreign_proponents_id?: string;
	student_id?: number;
	name: string;
	student: {
		name: string;
		student_id: string;
		instructor_id: number;
		section: string;
		id: number;
		document: {
			id: number;
			title_name: string;
			status: string;
			approved_date: Date;
			passed_date: Date;
		}[];
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
	projectAdviser: AdviserProps;
	onToggle: () => void;
	onSelectDocument: (document: DocumentProps) => void;
	selectedDocument: DocumentProps | null;
	setProjectAdviser: (adviser: AdviserProps) => void;
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
