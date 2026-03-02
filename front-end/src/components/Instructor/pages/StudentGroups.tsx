import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import { apiStudentUrl } from '@/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import GroupsComponent from '../components/GroupsComponent';

const StudentGroups = () => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<ProponentsDocumentsProps[]>([]);
	const fetchProponents = async () => {
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
				await setProjects(result.projects);
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
				<GroupsComponent projects={projects} />
			)}
		</>
	);
};

export default StudentGroups;
