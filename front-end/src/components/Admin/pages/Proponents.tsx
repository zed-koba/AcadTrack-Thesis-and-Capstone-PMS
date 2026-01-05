import { apiUrl } from '@/components/Routes/http';
import {
	StudentsProponentsProps,
	type AdvisersProponentProps,
	type ProgramsProponentProps,
	type ProponentsProps,
} from '../interface/proponent';
import ProponentsTable from '../ProponentComponents/ProponentsTable';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Proponents = () => {
	const [proponents, setProponents] = useState<ProponentsProps[]>([]);
	const [advisers, setAdvisers] = useState<AdvisersProponentProps[]>([]);
	const [programs, setPrograms] = useState<ProgramsProponentProps[]>([]);
	const [students, setStudents] = useState<StudentsProponentsProps[]>([]);
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
				setPrograms(result.programs);
				setStudents(result.students);
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
			<div className="flex items-center justify-between text-white text-base">
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
						programs={programs}
						students={students}
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
