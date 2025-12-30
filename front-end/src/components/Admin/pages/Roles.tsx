import { apiUrl } from '@/components/Routes/http';
import { useEffect, useState } from 'react';
import RolesDashboard from '../RolesComponents/RolesDashboard';
import type { RolesProps, DepartmentRolesProps } from '../interface/roles';
import RolesTable from '../RolesComponents/RolesTable';

const Departments = () => {
	const [roles, setRoles] = useState<RolesProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentRolesProps[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchRoles = async () => {
		try {
			const res = await fetch(`${apiUrl}/roles`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setRoles(result.roles);
				setDepartments(result.departments);
			}
			// Handle the fetched data as needed
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchRoles();
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
			<RolesDashboard roles={roles} />
			<RolesTable
				departments={departments}
				roles={roles}
				loading={loading}
				refresh={fetchRoles}
			/>
		</>
	);
};

export default Departments;
