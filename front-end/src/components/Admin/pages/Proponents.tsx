import { apiUrl } from '@/Routes/http';
import type {
	RolesProponentsProps,
	StudentsProponentsProps,
	AdvisersProponentProps,
	ProponentsProps,
} from '../interface/proponent';
import ProponentsTable from '../ProponentComponents/ProponentsTable';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import type {
	DepartmentStudentsProps,
	InstructorStudentsProps,
} from '../interface/student';

const Proponents = () => {
	const [proponents, setProponents] = useState<ProponentsProps[]>([]);
	const [advisers, setAdvisers] = useState<AdvisersProponentProps[]>([]);
	const [students, setStudents] = useState<StudentsProponentsProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentStudentsProps[]>([]);
	const [instructors, setInstructors] = useState<InstructorStudentsProps[]>([]);
	const [roles, setRoles] = useState<RolesProponentsProps[]>([]);
	const [loading, setLoading] = useState(true);
	const fetchData = async () => {
		try {
			const res = await fetch(`${apiUrl}/proponents`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');

			const result = await res.json();
			if (result.status === 200) {
				setProponents(result.proponents);
				setAdvisers(result.advisers);
				setStudents(result.students);
				setDepartments(result.departments);
				setInstructors(result.instructors);
				setRoles(result.roles);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<div className="flex  text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Thesis and Capstones</span>
					<span className="text-sm text-white">
						Manage proponents records and project approval status.
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<ProponentsTable
						advisers={advisers}
						students={students}
						departments={departments}
						instructors={instructors}
						roles={roles}
						proponents={proponents}
						loading={loading}
						refresh={fetchData}
					/>
				</>
			)}
		</>
	);
};

export default Proponents;
