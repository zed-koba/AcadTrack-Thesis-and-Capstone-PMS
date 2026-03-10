import { useEffect, useState } from 'react';
import type { Deadlines } from '../interface/deadlines';
import type { DocumentProps } from '@/components/Student/interface/document';
import { apiInstructorUrl } from '@/Routes/http';
import { getInformation } from '@/components/functions/functions';
import { Spinner } from '@/components/ui/spinner';
import DashboardComponent from '../components/DashboardComponent';
import type { ProponentsWithFeatures } from '../interface/dashboard';

const InstructorDashboard = () => {
	const [projects, setProjects] = useState<ProponentsWithFeatures[]>([]);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const [documents, setDocuments] = useState<DocumentProps[]>([]);
	const [loading, setLoading] = useState(false);
	const information = getInformation();
	const fetchDatas = async () => {
		try {
			setLoading(true);
			const res = await fetch(`${apiInstructorUrl}/datas/${information.id}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
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
				<DashboardComponent
					projects={projects}
					documents={documents}
					deadlines={deadlines}
				/>
			)}
		</>
	);
};

export default InstructorDashboard;
