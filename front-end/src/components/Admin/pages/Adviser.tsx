import { apiUrl } from '@/components/Routes/http';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import type {
	AdviserProps,
	DepartmentAdviserProps,
} from '../interface/adviser';
import AdvisersDashboard from '../AdviserComponents/AdviserDashboard';
import AdviserTable from '../AdviserComponents/AdviserTable';

const Advisers = () => {
	const [advisers, setAdvisers] = useState<AdviserProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentAdviserProps[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchAdvisers = async () => {
		try {
			const res = await fetch(`${apiUrl}/advisers`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setAdvisers(result.advisers);
				setDepartments(result.departments);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchAdvisers();
	}, []);
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Advisers Management</span>
					<span className="text-sm text-white">
						Manage advisers for capstone and thesis groups
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<AdvisersDashboard advisers={advisers} />
					<AdviserTable
						departments={departments}
						advisers={advisers}
						loading={loading}
						refresh={fetchAdvisers}
					/>
				</>
			)}
		</>
	);
};

export default Advisers;
