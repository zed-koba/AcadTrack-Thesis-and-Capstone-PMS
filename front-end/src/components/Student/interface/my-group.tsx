import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import type { RolesProps } from '@/components/Admin/interface/roles';
import type { StudentProps } from '@/components/Admin/interface/student';
import type { DetailsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';

export type MyProjectProps = Omit<ProponentsProps, 'details'> & {
	details: DetailsDocumentsProps[];
	group_leader: StudentProps;
};

export type GroupComponentProps = {
	project: MyProjectProps | undefined;
	roles: RolesProps[];
	refresh?: () => void;
};

export type TransferLeadershipProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	members: DetailsDocumentsProps[];
	refresh?: () => void;
};

export type LeaveGroupProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedId: number;
	refresh?: () => void;
};
