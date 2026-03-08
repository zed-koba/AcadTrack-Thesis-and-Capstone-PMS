import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import type { DevelopmentProcessProps } from '@/components/Student/interface/developmentprocess';

export type DevelopmentMonitoringProps = {
	projects: ProponentsProps[];
	developments: DevelopmentProcessProps[];
	refresh?: () => void;
};

export type DevelopmentMonitoringContentProps = {
	project: ProponentsProps | undefined;
	developments: DevelopmentProcessProps[];
	refresh?: () => void;
};

export type DevelopmentMonitoringGanttChartProps = {
	developments: DevelopmentProcessProps[];
};
