import { projectId, userToken } from '@/components/functions/functions';
import { apiStudentUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import type { MyProjectProps } from '../interface/my-group';
import type { RolesProps } from '@/components/Admin/interface/roles';
import { Spinner } from '@/components/ui/spinner';
import GroupComponents from '../MyGroupComponents/GroupComponent';

const MyGroups = () => {
	const [project, setProject] = useState<MyProjectProps>();
	const [roles, setRoles] = useState<RolesProps[]>([]);

	const [loading, setLoading] = useState(false);
	const fetchGroup = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiStudentUrl}/my-group/${projectId.proponents_id}`,
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
			setProject(result.project);
			setRoles(result.roles);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchGroup();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Group Management</span>
					<span className="text-sm text-white">
						Manage your thesis/capstone group members and roles
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<GroupComponents
						project={project}
						roles={roles}
						refresh={fetchGroup}
					/>
				</>
			)}
		</>
	);
};

export default MyGroups;
