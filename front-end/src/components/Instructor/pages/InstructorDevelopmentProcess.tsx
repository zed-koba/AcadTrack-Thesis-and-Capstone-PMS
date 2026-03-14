import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import { getInformation, getUserToken } from '@/components/functions/functions';
import { Spinner } from '@/components/ui/spinner';
import { apiInstructorUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import DevelopmentMonitoring from '../components/DPMonitoring';
import type { DevelopmentProcessProps } from '@/components/Student/interface/developmentprocess';

const InstructorDevelopmentProcess = () => {
	const [developments, setDevelopments] = useState<DevelopmentProcessProps[]>(
		[],
	);
	const [projects, setProjects] = useState<ProponentsProps[]>([]);
	const information = getInformation();
	const userToken = getUserToken();
	const [loading, setLoading] = useState(false);
	const fetchDevelopment = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiInstructorUrl}/development-process/${information.id}`,
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
			setDevelopments(result.developments);
			setProjects(result.projects);
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
					<span className="text-2xl text-white">
						Development Process Monitoring
					</span>
					<span className="text-sm text-white">
						Oversee thesis/capstone groups development timelines (read-only)
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<DevelopmentMonitoring
						projects={projects}
						developments={developments}
						refresh={fetchDevelopment}
					/>
				</>
			)}
		</>
	);
};

export default InstructorDevelopmentProcess;
