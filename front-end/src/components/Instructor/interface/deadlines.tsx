import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';

export type RiskLevel =
	| 'on-track'
	| 'slightly-delayed'
	| 'at-risk'
	| 'critical';

export type Deadlines = {
	id: number;
	document_title: string;
	deadline: Date;
	instructor_id: number;
	instructor: {
		id: number;
		name: string;
	};
	created_at: string;
	updated_at: string;
};

export type DeadlineComponentProps = {
	deadlines: Deadlines[] | undefined;
	projects: ProponentsDocumentsProps[] | undefined;
	refresh?: () => void;
};

export type SetDealineComponentProps = {
	deadline: Deadlines | null;
	refresh?: () => void;
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
};

export type DeadlineDeleteProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	deadline_id?: number;
	refresh?: () => void;
};

export const getRiskColor = (risk: RiskLevel): string => {
	switch (risk) {
		case 'on-track':
			return 'bg-green-500/20 text-green-400 border-green-500/30';
		case 'slightly-delayed':
			return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
		case 'at-risk':
			return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
		case 'critical':
			return 'bg-red-500/20 text-red-400 border-red-500/30';
	}
};
