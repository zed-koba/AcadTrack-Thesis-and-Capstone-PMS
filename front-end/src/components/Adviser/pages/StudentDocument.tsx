import { apiAdviserUrl } from '@/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import DocumentDashboard from '../components/StudentDocumentsComponents/DocumentDashboard';
import type { DocumentProps } from '@/components/Student/interface/document';
import DocumentContent from '../components/StudentDocumentsComponents/DocumentContent';
import type { ProponentsDocumentsProps } from '../interface/adviserdocument';
import { getInformation, getUserToken } from '@/components/functions/functions';

const StudentDocument = () => {
	const [loading, setLoading] = useState(true);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);
	const [selectedDocument, setSelectedDocument] =
		useState<DocumentProps | null>(null);
	const information = getInformation();
	const userToken = getUserToken();
	const fetchDocuments = async () => {
		try {
			const res = await fetch(`${apiAdviserUrl}/documents/${information.id}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
			});

			const result = await res.json();
			if (!res.ok) throw new Error('Failed to fetch data');
			if (result.status === 200) {
				setDocuments(result.document);
				setProjects(result.projects);
				return result.document;
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
		return [];
	};
	useEffect(() => {
		fetchDocuments();
	}, []);

	const refresh = async () => {
		const updatedDocs = await fetchDocuments();

		// if a document is selected, update it from the new list
		if (selectedDocument) {
			const updatedSelected = updatedDocs.find(
				(doc: { id: number }) => doc.id === selectedDocument.id,
			);
			setSelectedDocument(updatedSelected || null);
		}
	};
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
					<DocumentContent
						projects={projects}
						documents={documents}
						refresh={refresh}
						loading={loading}
						selectedDocument={selectedDocument}
						setSelectedDocument={setSelectedDocument}
					/>
				</>
			)}
		</>
	);
};

export default StudentDocument;
