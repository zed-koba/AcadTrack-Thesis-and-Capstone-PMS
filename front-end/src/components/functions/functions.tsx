import { toast } from 'sonner';
import { apiStudentUrl } from '../Routes/http';
import type { JSX } from 'react/jsx-runtime';
import {
	CalendarCheck,
	CalendarClock,
	CalendarX,
	CircleCheckBig,
	Clock,
	Eye,
	FileExclamationPoint,
	RefreshCcw,
	X,
} from 'lucide-react';
import type {
	ChapterDocumentsProps,
	ProponentsDocumentsProps,
} from '../Adviser/interface/adviserdocument';
import type { AdviserWeeklyProps } from '../Adviser/interface/consultation';

export function formatDate(dateString: string) {
	const date = new Date(dateString);

	return date.toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

export function formatDateWithTime(dateString: string) {
	const date = new Date(dateString);

	const datePart = date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	const timePart = date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});

	return `${datePart} at ${timePart}`;
}

export const downloadDocument = async (docId: number, name: string) => {
	try {
		const res = await fetch(`${apiStudentUrl}/${docId}/download/pdf`);
		if (!res.ok) throw new Error('Failed to download file');

		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log(error);
		toast.error('Download failed');
	}
};

export function formatFileSize(sizeInBytes: number): string {
	if (sizeInBytes < 1024) {
		return `${sizeInBytes} B`; // bytes
	} else {
		const mb = sizeInBytes / (1024 * 1024);
		return `${mb.toFixed(2)} MB`; // megabytes
	}
}

export const statusColor: Record<string, string> = {
	pending: 'bg-amber-500/20 border-amber-500/40 text-amber-500',
	'under review': 'bg-success/20 border-success/40 text-success',
	'need revision': 'bg-red-500/20 border-red-500/40 text-red-500',
	'approved': 'bg-green-500/20 border-green-500/40 text-green-500',
	'ongoing': 'bg-sky-500/20 border-sky-500/40 text-sky-500',
	'rejected': 'bg-red-500/20 border-red-500/40 text-red-500',
	'cancelled': 'bg-red-500/20 border-red-500/40 text-red-500',
	'expired': 'bg-slate-500/20 border-slate-500/40 text-slate-200',
	'general': 'bg-primary/20 border-primary/40 text-primary',
	'revised': 'bg-teal-500/20 border-teal-500/20 text-teal-500',
};
export const chapterStatusIcon: Record<string, JSX.Element> = {
	pending: <Clock />,
	'under review': <Eye />,
	'need revision': <FileExclamationPoint />,
	'approved': <CircleCheckBig />,
	'revised': <RefreshCcw />,
};
export const consultationIcon: Record<string, JSX.Element> = {
	pending: <Clock className="h-3 w-3 mr-1" />,
	rejected: <X className="h-3 w-3 mr-1" />,
	cancelled: <X className="h-3 w-3 mr-1" />,
	approved: <CircleCheckBig className="h-3 w-3 mr-1" />,
	completed: <CalendarCheck className="h-3 w-3 mr-1" />,
	expired: <CalendarX className="h-3 w-3 mr-1" />,
	ongoing: <CalendarClock className="h-3 w-3 mr-1" />,
};

export const getProjectStatus = (chaptersGrouped: ChapterDocumentsProps[]) => {
	if (chaptersGrouped.length === 0) return 'No Document';

	const lastChapter = chaptersGrouped.at(-1);
	if (!lastChapter || lastChapter.documents.length === 0) return null;

	const doc = lastChapter.documents[0];

	return doc.versions.length > 0 ? doc.versions[0].status : doc.status;
};

export const studentId = 2;
export const adviserId = 1;

const dayToNumber: Record<string, number> = {
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
	sunday: 7,
};

export const getDayNumber = (day: string): number => {
	const key = day.toLowerCase();
	if (!(key in dayToNumber)) {
		throw new Error(`Invalid day: ${day}`);
	}
	return dayToNumber[key];
};
const now = new Date();
export const upcomingSessions = (weeklies: AdviserWeeklyProps[]) => {
	const getUpcoming = weeklies.filter((s) => {
		const endDateTime = new Date(`${s.date}T${s.end_time}`);

		return endDateTime > now && s.status !== "rejected" && s.status !== "completed" && s.status !== "cancelled";
	});

	return getUpcoming;
};

export const pastSessions = (weeklies: AdviserWeeklyProps[]) => {
	const getUpcoming = weeklies.filter((s) => {
		const endDateTime = new Date(`${s.date}T${s.end_time}`);

		return endDateTime < now || s.status === "rejected" || s.status === "cancelled" || s.status === "completed";
	});

	return getUpcoming;
};

export const getDateLabel = (dateStr: string): string => {
	const target = new Date(dateStr);
	const now = new Date();

	// Normalize both to midnight
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	const targetDay = new Date(
		target.getFullYear(),
		target.getMonth(),
		target.getDate(),
	);

	if (targetDay.getTime() === tomorrow.getTime()) {
		return 'Tomorrow';
	}

	return target.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case 'approved':
			return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-sky-500/30';
		case 'pending':
			return 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30';
		case 'completed':
			return 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30';
		case 'rejected':
			return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
		case 'cancelled':
			return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
		case 'expired':
			return 'bg-slate-500/20 border-slate-500/50 text-slate-200 hover:bg-slate-500/30';
		case 'ongoing':
			return 'bg-sky-500/20 border-sky-500/50 text-sky-500 hover:bg-sky-500/30';
		default:
			return 'bg-muted';
	}
};

export const studentIds = (project?: ProponentsDocumentsProps | null) => {
	return (project?.details.map((d) => d.student_id) ?? []).filter(
		(id) => id !== undefined,
	);
};
