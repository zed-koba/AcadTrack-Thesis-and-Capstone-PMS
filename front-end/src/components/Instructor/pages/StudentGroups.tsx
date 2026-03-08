import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import { apiInstructorUrl } from '@/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import GroupsComponent from '../components/GroupsComponent';
import { information } from '@/components/functions/functions';
import type { DocumentProps } from '@/components/Student/interface/document';
import type { Deadlines } from '../interface/deadlines';

const StudentGroups = () => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const fetchProponents = async () => {
		try {
			const res = await fetch(
				`${apiInstructorUrl}/documents/${information.id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
				},
			);

			const result = await res.json();
			if (!res.ok) throw new Error('Failed to fetch data');
			if (result.status === 200) {
				await setProjects(result.projects);
				await setDocuments(result.document);
				await setDeadlines(result.deadline);
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
		fetchProponents();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Students Groups</span>
					<span className="text-sm text-white">
						Monitor thesis/capstone group milestones and performance
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<GroupsComponent
					projects={projects}
					documents={documents}
					deadlines={deadlines}
				/>
			)}
		</>
	);
};

export default StudentGroups;
