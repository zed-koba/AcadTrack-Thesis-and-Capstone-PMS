import { apiUrl } from '@/components/Routes/http';
import {
	type InstructorStudentsProps,
	type DepartmentStudentsProps,
	type ProgramsStudentsProps,
	type RolesStudentsProps,
	type StudentProps,
} from '../interface/student';
import StudentTable from '../StudentComponents/StudentTable';
import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { ProponentsProps } from '../interface/proponent';

const Students = () => {
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState<StudentProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentStudentsProps[]>([]);
	const [roles, setRoles] = useState<RolesStudentsProps[]>([]);
	const [instructors, setInstructors] = useState<InstructorStudentsProps[]>([]);
	const [programs, setPrograms] = useState<ProgramsStudentsProps[]>([]);
	const [proponents, setProponents] = useState<ProponentsProps[]>([]);
	const fetchStudents = async () => {
		try {
			const res = await fetch(`${apiUrl}/students`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setStudents(result.students);
				setInstructors(result.instructors);
				setDepartments(result.departments);
				setRoles(result.roles);
				setPrograms(result.programs);
				setProponents(result.proponents);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchStudents();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Student List</span>
					<span className="text-sm text-white">
						Manage students records and approval status
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<StudentTable
						students={students}
						proponents={proponents}
						roles={roles}
						programs={programs}
						departments={departments}
						instructors={instructors}
						loading={loading}
						refresh={fetchStudents}
					/>
				</>
			)}
		</>
	);
};

export default Students;
