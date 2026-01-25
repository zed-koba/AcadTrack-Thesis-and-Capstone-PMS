export const DAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];
export const to24HourTime = (time12h: string): string => {
	const [time, modifier] = time12h.split(' ');
	let [hours, minutes] = time.split(':').map(Number);

	if (modifier === 'PM' && hours !== 12) {
		hours += 12;
	}
	if (modifier === 'AM' && hours === 12) {
		hours = 0;
	}

	return `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}:00`;
};

export const to12HourTime = (time24h: string): string => {
	const [hoursStr, minutesStr] = time24h.split(':');
	let hours = Number(hoursStr);
	const minutes = Number(minutesStr);

	const modifier = hours >= 12 ? 'PM' : 'AM';

	hours = hours % 12;
	if (hours === 0) hours = 12;

	return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
};

export type AdviserAvailabilityProps = {
	id: number;
	adviser_id: number;
	start_time: string;
	end_time: string;
	day: string;
	is_available: boolean;
	adviser: {
		id: number;
		name: string;
		duration: number;
		consultation_limit: number;
	};
};

export type AdviserWeeklyProps = {
	id: number;
	adviser_id: number;
	student_id: number;
	day_of_week: number;
	start_time: string;
	end_time: string;
	actual_start: string;
	actual_end: string;
	overrunMinutes: number;
	date: string;
	status: string;
	purpose: string;
	feedback: string;
	student: {
		id: number;
		name: string;
		proponent_detail: {
			student_id: number;
			foreign_proponents_id: string;
			proponent: {
				proponents_id: string;
				title: string;
			};
		};
	};
	adviser: {
		id: string;
		name: string;
		duration: number;
	};
};
export type ConsultationDialogProps = {
	weekly: AdviserWeeklyProps | null;
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
};
export type ConsultationDashboardProps = {
	weeklies: AdviserWeeklyProps[];
};
export type AvailabilityConsultationProps = {
	availabilities: AdviserAvailabilityProps[];
	refresh?: () => void;
};
export type WeeklyConsultationProps = {
	weeklies: AdviserWeeklyProps[];
	refresh?: () => void;
};
export type ConsultationContentProps = {
	availabilities: AdviserAvailabilityProps[];
	weeklies: AdviserWeeklyProps[];
	refresh?: () => void;
};
export type DeleteScheduleProps = {
	sched_id: number;
	open: boolean;
	setOpen: (open: boolean) => void;
	refresh?: () => void;
};
const toMinutes = (time12h: string): number => {
	const [time, modifier] = time12h.split(' ');
	let [h, m] = time.split(':').map(Number);

	if (modifier === 'PM' && h !== 12) h += 12;
	if (modifier === 'AM' && h === 12) h = 0;

	return h * 60 + m;
};

const dbTimeToMinutes = (time24h: string): number => {
	const [h, m] = time24h.split(':').map(Number);
	return h * 60 + m;
};

export const getValidEndTimes = (
	AVAIL_TIME: string[],
	selectedStartTime: string,
	selectedDay: string,
	availabilities: AdviserAvailabilityProps[],
) => {
	const startMinutes = toMinutes(selectedStartTime);

	const dayAvailabilities = availabilities.filter((a) => a.day === selectedDay);

	return AVAIL_TIME.filter((endTime) => {
		const endMinutes = toMinutes(endTime);

		// 1. Must be AFTER start time
		if (endMinutes <= startMinutes) return false;

		// 2. Must NOT overlap existing slots
		for (const a of dayAvailabilities) {
			const existingStart = dbTimeToMinutes(a.start_time);
			const existingEnd = dbTimeToMinutes(a.end_time);

			// overlap or boundary collision
			if (endMinutes > existingStart && startMinutes < existingEnd) {
				return false;
			}
		}

		return true;
	});
};

export const getValidStartTimes = (
	AVAIL_TIME: string[],
	selectedDay: string,
	availabilities: {
		day: string;
		start_time: string;
		end_time: string;
	}[],
) => {
	const dayAvailabilities = availabilities.filter((a) => a.day === selectedDay);

	return AVAIL_TIME.filter((startTime) => {
		const startMinutes = toMinutes(startTime);

		// 1️⃣ Must NOT overlap existing slots
		for (const a of dayAvailabilities) {
			const existingStart = dbTimeToMinutes(a.start_time);
			const existingEnd = dbTimeToMinutes(a.end_time);

			// inside or boundary collision
			if (startMinutes >= existingStart && startMinutes < existingEnd) {
				return false;
			}
		}

		// 2️⃣ Must have at least ONE valid end time
		const possibleEnds = AVAIL_TIME.filter((endTime) => {
			const endMinutes = toMinutes(endTime);

			if (endMinutes <= startMinutes) return false;

			for (const a of dayAvailabilities) {
				const existingStart = dbTimeToMinutes(a.start_time);
				const existingEnd = dbTimeToMinutes(a.end_time);

				if (endMinutes > existingStart && startMinutes < existingEnd) {
					return false;
				}
			}

			return true;
		});

		return possibleEnds.length > 0;
	});
};

export const formatTime = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
