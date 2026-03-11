import { addDays, isSameDay } from 'date-fns';
type ConsultationStatus = 'upcoming' | 'completed' | 'cancelled';

export interface CalendarConsultation {
	id: number;
	student_id: number;
	project_name: string;
	project_id: string;
	date: Date;
	scheduledStart: string; // "HH:mm"
	scheduledEnd: string;
	status: ConsultationStatus;
}

export interface AdviserAvailability {
	date: Date;
	start: string; // "HH:mm"
	end: string;
}

export interface RescheduledSlot {
	date: Date;
	startTime: string;
	endTime: string;
}
function toMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
}
export function autoRescheduleConsultation(
	cancelled: CalendarConsultation,
	consultations: CalendarConsultation[],
	adviserAvailability: AdviserAvailability[],
	maxDaysAhead: number = 5,
): RescheduledSlot | null {
	const originalTime = toMinutes(cancelled.scheduledStart);
	const cancelledDate = cancelled.date;

	for (let dayOffset = 0; dayOffset <= maxDaysAhead; dayOffset++) {
		const searchDate = addDays(cancelledDate, dayOffset);

		const dayBookings = consultations
			.filter((c) => isSameDay(c.date, searchDate) && c.id !== cancelled.id)
			.map((c) => ({
				start: toMinutes(c.scheduledStart),
				end: toMinutes(c.scheduledEnd),
			}));

		const daySlots = adviserAvailability.filter((slot) =>
			isSameDay(slot.date, searchDate),
		);

		for (const slot of daySlots) {
			const slotStart = toMinutes(slot.start);
			const slotEnd = toMinutes(slot.end);

			// If Same day dont allow earlier slots
			if (dayOffset === 0 && slotStart < originalTime + 1) continue;

			const conflict = dayBookings.some(
				(b) => slotStart < b.end && slotEnd > b.start,
			);

			if (!conflict) {
				return {
					date: searchDate,
					startTime: slot.start,
					endTime: slot.end,
				};
			}
		}
	}

	return null;
}
