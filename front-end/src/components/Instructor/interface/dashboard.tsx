import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import type { Deadlines } from './deadlines';
import type { DocumentProps } from '@/components/Student/interface/document';
import type { DevelopmentProcessProps } from '@/components/Student/interface/developmentprocess';

export type ProponentsWithFeatures = ProponentsDocumentsProps & {
	features: Omit<DevelopmentProcessProps, 'project'>[];
};
export type InstructorDashboardProps = {
	projects: ProponentsWithFeatures[];
	deadlines: Deadlines[];
	documents: DocumentProps[];
};
