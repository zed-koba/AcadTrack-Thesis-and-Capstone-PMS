import type {
	ProjectWithStatus,
	ProponentsDocumentsProps,
} from '@/components/Adviser/interface/adviserdocument';
import type { DocumentProps } from '@/components/Student/interface/document';
import type { Deadlines } from './deadlines';
import type { ProponentsProps } from '@/components/Admin/interface/proponent';

export type ArchivingProps = {
	id: number;
	foreign_proponents_id: string;
	title_name: string;
	original_name: string;
	path: string;
	version: number;
	passed_date: Date;
	archived_date: Date;
	created_at: Date;
	updated_at: Date;
	project: ProponentsDocumentsProps;
};

export type ArchivingContentProps = {
	archives: ArchivingProps[];
	documents: ArchivingPendingProps[];
	deadlines: Deadlines[];
	refresh?: () => void;
};

export type ArchivingPendingProps = Omit<
	DocumentProps,
	'versions' | 'comments' | 'student'
> & {
	student: {
		id: number;
		name: string;
		student_id: string;
		proponent_detail: {
			foreign_proponents_id: string;
		};
		program: {
			id: number;
			name: string;
			code: string;
		};
		project: {
			proponents_id: string;
			title: string;
			adviser: {
				id: number;
				name: string;
			};
			details: {
				student: {
					id: number;
					name: string;
				};
			}[];
		};
	};
};
