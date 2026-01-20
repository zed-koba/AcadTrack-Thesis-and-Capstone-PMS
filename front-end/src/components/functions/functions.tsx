import { toast } from 'sonner';
import { apiStudentUrl } from '../Routes/http';
import type { JSX } from 'react/jsx-runtime';
import {
	CircleCheckBig,
	Clock,
	Eye,
	FileExclamationPoint,
	RefreshCcw,
} from 'lucide-react';
import type { ChapterDocumentsProps } from '../Adviser/interface/adviserdocument';

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

export const getProjectStatus = (chaptersGrouped: ChapterDocumentsProps[]) => {
	if (chaptersGrouped.length === 0) return 'No Document';

	const lastChapter = chaptersGrouped.at(-1);
	if (!lastChapter || lastChapter.documents.length === 0) return null;

	const doc = lastChapter.documents[0];

	return doc.versions.length > 0 ? doc.versions[0].status : doc.status;
};

export const studentId = 2;
