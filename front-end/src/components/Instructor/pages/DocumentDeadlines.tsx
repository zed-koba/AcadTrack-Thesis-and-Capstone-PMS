import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import type { Deadlines } from '../interface/deadlines';
import { apiInstructorUrl } from '@/Routes/http';
import DeadlinesComponent from '../components/DeadlinesComponent';
import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import { instructorId } from '@/components/functions/functions';
const DocumentDeadlines = () => {
	const [loading, setLoading] = useState(false);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);

	const fetchDeadlines = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${apiInstructorUrl}/deadlines/${instructorId}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			const data = await res.json();
			await setProjects(data.projects);
			await setDeadlines(data.deadlines);
		} catch (error) {
			console.error('Error fetching deadlines:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDeadlines();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Deadline Management</span>
					<span className="text-sm text-white">
						Set deadlines and track overdue submissions
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<DeadlinesComponent
						projects={projects}
						deadlines={deadlines}
						refresh={fetchDeadlines}
					/>
				</>
			)}
		</>
	);
};

export default DocumentDeadlines;
