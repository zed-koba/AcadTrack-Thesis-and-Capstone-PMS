import { apiUrl } from '@/components/Routes/http';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import AdvisersDashboard from '../AdviserComponents/AdviserDashboard';
import AdviserTable from '../AdviserComponents/AdviserTable';
import type {
	DepartmentInstructorProps,
	InstructorProps,
} from '../interface/instructor';
import InstructorDashboard from '../InstructorComponents/InstructorDashboard';
import InstructorTable from '../InstructorComponents/InstructorTable';

const Instructors = () => {
	const [instructors, setInstructors] = useState<InstructorProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentInstructorProps[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	const fetchInstructors = async () => {
		try {
			const res = await fetch(`${apiUrl}/instructors`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setInstructors(result.instructor);
				setDepartments(result.departments);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchInstructors();
	}, []);
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Instructors Management</span>
					<span className="text-sm text-white">
						Manage instructors for capstone and thesis groups
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<InstructorDashboard instructors={instructors} />
					<InstructorTable
						departments={departments}
						instructors={instructors}
						loading={loading}
						refresh={fetchInstructors}
					/>
				</>
			)}
		</>
	);
};

export default Instructors;
