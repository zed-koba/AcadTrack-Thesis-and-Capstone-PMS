import { useEffect, useState } from 'react';

import type { DocumentProps } from '@/components/Student/interface/document';
import { apiAdviserUrl } from '@/Routes/http';
import { getInformation, getUserToken } from '@/components/functions/functions';
import { Spinner } from '@/components/ui/spinner';
import type { ProponentsWithFeatures } from '@/components/Instructor/interface/dashboard';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';
import AdviserDashboardComponent from '../components/DashboardComponents/AdviserDashboardComponent';

const AdviserDashboard = () => {
	const [projects, setProjects] = useState<ProponentsWithFeatures[]>([]);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [loading, setLoading] = useState(false);
	const information = getInformation();
	const userToken = getUserToken();
	const fetchDatas = async () => {
		try {
			setLoading(true);
			const res = await fetch(`${apiAdviserUrl}/datas/${information.id}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
			});
			if (!res.ok) throw new Error('Faild to fetch data');
			const result = await res.json();
			await setProjects(result.projects);
			await setDeadlines(result.deadlines);
			await setDocuments(result.documents);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDatas();
	}, []);

	return (
		<>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<AdviserDashboardComponent
					projects={projects}
					documents={documents}
					deadlines={deadlines}
				/>
			)}
		</>
	);
};

export default AdviserDashboard;
