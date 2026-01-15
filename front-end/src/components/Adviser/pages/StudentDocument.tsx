import { apiStudentUrl } from '@/components/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import DocumentDashboard from '../components/StudentDocumentsComponents/DocumentDashboard';
import type { DocumentProps } from '@/components/Student/interface/document';
import DocumentContent from '../components/StudentDocumentsComponents/DocumentContent';

const StudentDocument = () => {
	const [loading, setLoading] = useState(true);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const fetchDocuments = async () => {
		try {
			const res = await fetch(`${apiStudentUrl}/1/documents`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});

			const result = await res.json();
			if (!res.ok) throw new Error('Failed to fetch data');
			if (result.status === 200) {
				await setDocuments(result.document);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDocuments();
	}, []);
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Students Documents</span>
					<span className="text-sm text-white">
						Review, and provide comments on student submissions
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<DocumentDashboard documents={documents} />
					<DocumentContent documents={documents} refresh={fetchDocuments} />
				</>
			)}
		</>
	);
};

export default StudentDocument;
