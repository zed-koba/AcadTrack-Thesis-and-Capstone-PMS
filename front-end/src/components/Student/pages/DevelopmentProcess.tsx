import { useEffect, useState } from 'react';
import type { DevelopmentProcessProps } from '../interface/developmentprocess';
import { Spinner } from '@/components/ui/spinner';
import { apiStudentUrl } from '@/Routes/http';
import { projectId, userToken } from '@/components/functions/functions';
import StudentDevelopmentProcessComponent from '../DevelopmentProcess.tsx/StudentDP';

const StudentDevelopmentProcess = () => {
	const [developments, setDevelopments] = useState<DevelopmentProcessProps[]>(
		[],
	);

	const [loading, setLoading] = useState(false);
	const fetchDevelopment = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiStudentUrl}/development-process/${projectId.proponents_id}`,
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
			setDevelopments(result.development);
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
					<StudentDevelopmentProcessComponent
						developments={developments}
						refresh={fetchDevelopment}
					/>
				</>
			)}
		</>
	);
};

export default StudentDevelopmentProcess;
