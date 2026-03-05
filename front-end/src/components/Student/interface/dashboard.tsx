import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import type { StudentProps } from '@/components/Admin/interface/student';

export type TaskList = {
	id: number;
	foreign_proponents_id: string;
	task: string;
	deadline: Date;
	is_completed: number;
	created_at: string;
	updated_at: string;
};

export type ProjectProps = ProponentsProps & {
	adviser: {
		id: number;
		name: string;
	};
};

export type StudentDetailsProps = StudentProps & {
	instructor: {
		id: number;
		name: string;
	};
};
