import { toast } from 'sonner';
import { apiStudentUrl } from '../Routes/http';

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
