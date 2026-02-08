import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import DocumentDashboard from '../DocumentComponents/DocumentDashboard';
import DocumentContent from '../DocumentComponents/DocumentContent';
import type { DocumentProps } from '../interface/document';
import { apiStudentUrl } from '@/components/Routes/http';
import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';

import { studentId } from '@/components/functions/functions';

const Document = () => {
	const [loading, setLoading] = useState(true);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);
	const [project, setProject] = useState<ProponentsDocumentsProps | null>(null);

	const fetchDocuments = async () => {
		try {
			const res = await fetch(`${apiStudentUrl}/documents`, {
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
				await setProjects(result.projects);
				setProject(
					result.projects.find((p: ProponentsDocumentsProps) =>
						p.details.some((detail) => detail.student.id === studentId),
					) ?? null,
				);
				return result.document;
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);

			// console.log(
			// 	projects.find((p) =>
			// 		p.details.some((detail) => detail.student.id === 1),
			// 	),
			// );
		}
	};
	useEffect(() => {
		fetchDocuments();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">My Documents</span>
					<span className="text-sm text-white">
						Upload and manage your academic documents
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<DocumentDashboard documents={documents} project={project} />
					<DocumentContent
						documents={documents}
						project={project}
						refresh={fetchDocuments}
					/>
				</>
			)}
		</>
	);
};

export default Document;
