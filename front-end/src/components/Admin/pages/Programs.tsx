import { apiUrl } from '@/components/Routes/http';
import { useEffect, useState } from 'react';
import type {
	DepartmentProgramsProps,
	ProgramsProps,
} from '../interface/programs';
import ProgramsDashboard from '../ProgramsComponents/ProgramsDashboard';
import ProgramsTable from '../ProgramsComponents/ProgramsTable';
import { Spinner } from '@/components/ui/spinner';

const Programs = () => {
	const [programs, setPrograms] = useState<ProgramsProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentProgramsProps[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPrograms = async () => {
		try {
			const res = await fetch(`${apiUrl}/programs`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setPrograms(result.programs);
				setDepartments(result.departments);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchPrograms();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Roles Management</span>
					<span className="text-sm text-white">
						Manage roles for capstone and thesis groups
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<ProgramsDashboard programs={programs} />
					<ProgramsTable
						departments={departments}
						programs={programs}
						loading={loading}
						refresh={fetchPrograms}
					/>
				</>
			)}
		</>
	);
};

export default Programs;
