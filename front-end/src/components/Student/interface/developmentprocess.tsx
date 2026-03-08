import type { ProponentsProps } from '@/components/Admin/interface/proponent';
export type DevelopmentStatus =
	| 'not-started'
	| 'in-progress'
	| 'completed'
	| 'checked';
export type DevelopmentHealth =
	| 'in-progress'
	| 'completed'
	| 'completed-late'
	| 'overdue'
	| 'checked';

export type DevelopmentProcessProps = {
	id: number;
	foreign_proponents_id: string;
	feature: string;
	start_date: Date;
	end_date: Date;
	completed_date: Date;
	checked_date: Date;
	status: string;
	created_at: Date;
	updated_at: Date;
	project: ProponentsProps;
};

export type StudentDevelopmentProcessProps = {
	developments: DevelopmentProcessProps[];
	refresh?: () => void;
};
export type DevelopmentGanttChartProps = {
	developments: DevelopmentProcessProps[];
};

export type AddFeatureProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	development: DevelopmentProcessProps | null;
	refresh?: () => void;
	setSelectedFeature: (development: DevelopmentProcessProps | null) => void;
};

export type DeleteFeatureProps = {
	setSelectedId: (selectedId: number | null) => void;
	selectedId: number;
	refresh?: () => void;
};
export const getDevelopmentHealth = (
	development: DevelopmentProcessProps,
): DevelopmentHealth => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (development.status === 'completed') {
		if (development.completed_date > development.end_date) {
			return 'completed-late';
		}
		return 'completed';
	}

	if (today > development.end_date) {
		return 'overdue';
	}

	return 'in-progress';
};

export const getHealthColor = (health: DevelopmentHealth): string => {
	switch (health) {
		case 'completed':
			return 'bg-green-500';
		case 'completed-late':
			return 'bg-green-500/60';
		case 'overdue':
			return 'bg-destructive';
		case 'in-progress':
			return 'bg-muted-foreground/30';
		case 'checked':
			return 'bg-gray-500';
		default:
			return '';
	}
};
