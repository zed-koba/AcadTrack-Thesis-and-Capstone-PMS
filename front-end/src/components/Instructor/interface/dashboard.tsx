import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import type { Deadlines } from './deadlines';
import type { DocumentProps } from '@/components/Student/interface/document';

export type InstructorDashboardProps = {
	projects: ProponentsDocumentsProps[];
	deadlines: Deadlines[];
	documents: DocumentProps[];
};
