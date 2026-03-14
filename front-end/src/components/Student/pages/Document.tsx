import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import DocumentDashboard from '../DocumentComponents/DocumentDashboard';
import DocumentContent from '../DocumentComponents/DocumentContent';
import type { DocumentProps } from '../interface/document';
import { apiStudentUrl } from '@/Routes/http';
import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';

import { getInformation, getUserToken } from '@/components/functions/functions';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';

const Document = () => {
	const [loading, setLoading] = useState(true);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [deadlines, setDeadline] = useState<Deadlines[]>([]);
	const [project, setProject] = useState<ProponentsDocumentsProps | null>(null);
	const userToken = getUserToken();
	const information = getInformation();
	const fetchDocuments = async () => {
		try {
			const res = await fetch(`${apiStudentUrl}/documents/${information.id}`, {
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
				await setDocuments(result.document);
				await setDeadline(result.deadline);
				setProject(
					result.projects.find((p: ProponentsDocumentsProps) => {
						if (p.student_id === information.id) {
							return p;
						} else {
							return p.details.some(
								(detail) => detail.student.id === information.id,
							);
						}
					}) ?? null,
				);
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
						deadlines={deadlines}
						refresh={fetchDocuments}
					/>
				</>
			)}
		</>
	);
};

export default Document;
