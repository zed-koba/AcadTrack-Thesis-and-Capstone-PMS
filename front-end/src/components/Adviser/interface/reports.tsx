import type { AdviserWeeklyProps } from './consultation';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';
import type { ProponentsDocumentsProps } from './adviserdocument';
import type { DocumentProps } from '@/components/Student/interface/document';

export type ReportsProps = {
	weeklies: AdviserWeeklyProps[];

	deadlines: Deadlines[];
	projects: ProponentsDocumentsProps[];
	documents: Omit<DocumentProps, 'student' | 'comments'>[];
};
