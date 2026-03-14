import { apiUrl } from '@/Routes/http';
import DepartmentsDashboard from '../DepartmentsComponents/DepartmentsDashboard';
import DepartmentsTable from '../DepartmentsComponents/DepartmentsTable';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import type { DepartmentProps } from '../interface/department';

const Departments = () => {
	const [departments, setDepartments] = useState<DepartmentProps[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchDepartments = async () => {
		try {
			const res = await fetch(`${apiUrl}/departments`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setDepartments(result.data);
			}
			// Handle the fetched data as needed
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDepartments();
	}, []);
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Deparments Management</span>
					<span className="text-sm text-white">
						Manage departments as master data for the system
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					{' '}
					<DepartmentsDashboard departments={departments} />
					<DepartmentsTable
						departments={departments}
						loading={loading}
						refresh={fetchDepartments}
					/>
				</>
			)}
		</>
	);
};

export default Departments;
