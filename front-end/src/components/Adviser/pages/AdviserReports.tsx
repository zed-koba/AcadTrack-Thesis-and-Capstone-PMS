import { getInformation, getUserToken } from '@/components/functions/functions';

import { Spinner } from '@/components/ui/spinner';
import { apiAdviserUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import type { ProponentsDocumentsProps } from '../interface/adviserdocument';
import type { AdviserWeeklyProps } from '../interface/consultation';
import type { DocumentProps } from '@/components/Student/interface/document';
import ReportsContent from '../components/ReportsComponents.tsx/ReportsContent';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';

const AdviserReports = () => {
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);
	const [weeklies, setWeeklies] = useState<AdviserWeeklyProps[]>([]);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const [loading, setLoading] = useState(false);
	const userToken = getUserToken();
	const information = getInformation();
	const fetchDevelopment = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiAdviserUrl}/datas/reports/${information.id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
				},
			);
			if (!res.ok) throw new Error('Failed to fetch data');

			const result = await res.json();

			setProjects(result.projects);
			setWeeklies(result.weeklies);
			setDocuments(result.documents);
			setDeadlines(result.deadlines);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDevelopment();
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
					<ReportsContent
						documents={documents}
						projects={projects}
						weeklies={weeklies}
						deadlines={deadlines}
					/>
				</>
			)}
		</>
	);
};

export default AdviserReports;
