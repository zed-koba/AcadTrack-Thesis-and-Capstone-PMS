import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import type {
	ChapterDocumentsProps,
	ProponentsDocumentsProps,
} from '@/components/Adviser/interface/adviserdocument';

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
	student: {
		id: number;
		name: string;
		student_id: string;
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
	totalChapters: number;
	checkLastChapterStatus: boolean;
	refresh?: () => void;
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
	refresh?: () => void;
};

export type DocumentCardProps = {
	documents: DocumentProps[];
};
export type DocumentDashboardProps = {
	documents: DocumentProps[];
	project: ProponentsDocumentsProps | null;
};

export type ChapterItemProps = {
	currentDocument: DocumentProps;
	projectAdviser: AdviserProps | null;
	refresh?: () => void;
};

export type ChaptersProps = {
	chapter: ChapterDocumentsProps;
	isExpanded: boolean;
	onToggle: () => void;
	projectAdviser: AdviserProps | null;
	refresh?: () => void;
};
