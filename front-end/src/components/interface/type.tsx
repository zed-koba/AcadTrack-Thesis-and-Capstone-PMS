import type { JSX } from 'react';

export type NavItem = {
	label: string;
	to: string;
	icon: JSX.Element;
};

export type NotificationProps = {
	id: number;
	student_id: number;
	foreign_proponents_id: string;
	adviser_id: number;
	type: string;
	message: string;
	read_at: string;
	created_at: string;
	updated_at: string;
	student: {
		id: number;
		name: string;
	};
	project: {
		proponents_id: string;
		title: string;
	};
	adviser: {
		id: number;
		name: string;
	};
};
