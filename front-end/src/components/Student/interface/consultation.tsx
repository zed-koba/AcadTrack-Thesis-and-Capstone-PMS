import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import type {
	AdviserAvailabilityProps,
	AdviserWeeklyProps,
	AvailabilityConsultationProps,
} from '@/components/Adviser/interface/consultation';

export type ConsultationDashboardProps = {
	weeklies: AdviserWeeklyProps[];
	project: ProponentsDocumentsProps | null;
	availabilities: AdviserAvailabilityProps[];
};

export type ConsultationContentProps = {
	weeklies: AdviserWeeklyProps[];
	project: ProponentsDocumentsProps | null;
	availabilities: AdviserAvailabilityProps[];
	refresh?: () => void;
};

export type ConsultationCardProps = {
	weekly: AdviserWeeklyProps;
	project: ProponentsDocumentsProps | null;
};

export type BookConsultationprops = {
	open: boolean;
	setOpen: (open: boolean) => void;
	project: ProponentsDocumentsProps | null;
	availabilities: AdviserAvailabilityProps[];
	weeklies: AdviserWeeklyProps[];
	studentIds: number[];
	refresh?: () => void;
};

export type RescheduleConsultationprops = {
	open: boolean;
	setOpen: (open: boolean) => void;
	project: ProponentsDocumentsProps | null;
	availabilities: AdviserAvailabilityProps[];
	weeklies: AdviserWeeklyProps[];
	selectedSchedule: AdviserWeeklyProps;
	studentIds: number[];
	refresh?: () => void;
};

export type CancelAlertProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	project: ProponentsDocumentsProps | null;
	selectedSchedule: AdviserWeeklyProps;
};
