export type NotificationProps = {
	id: number;
	foreign_proponents_id: string;
	adviser_id: number;
	instructor_id: number;
	type: string;
	title: string;
	message: string;
	read_at: Date;
	created_at: Date;
	updated_at: Date;
	project: {
		id: number;
		proponents_id: string;
		adviser_id: number;
		student_id: number;
		group_leader: {
			id: number;
			name: string;
			instructor: {
				id: number;
				name: string;
			};
		};
	};
	adviser: {
		id: number;
		name: string;
	};
};
