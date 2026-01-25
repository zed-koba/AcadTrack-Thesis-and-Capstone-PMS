import { useEffect, useState } from 'react';
import ConsultationContent from '../components/ConsultationComponents/ConsultationContent';
import ConsultationDashboard from '../components/ConsultationComponents/ConsultationDashboard';
import type {
	AdviserAvailabilityProps,
	AdviserWeeklyProps,
} from '../interface/consultation';
import { apiAdviserUrl } from '@/components/Routes/http';
import { Spinner } from '@/components/ui/spinner';
import { adviserId } from '@/components/functions/functions';

const AdviserConsultation = () => {
	const [availabilities, setAvabilities] = useState<AdviserAvailabilityProps[]>(
		[],
	);

	const [weeklies, setWeeklies] = useState<AdviserWeeklyProps[]>([]);
	const [loading, setLoading] = useState(true);
	const fetchAvaibilities = async () => {
		try {
			const res = await fetch(`${apiAdviserUrl}/${adviserId}/availabilities`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setAvabilities(result.availabilities);
				setWeeklies(result.weeklies);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAvaibilities();
	}, []);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Consultation Management</span>
					<span className="text-sm text-white">
						Manage appointments and availability
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<ConsultationDashboard weeklies={weeklies} />
					<ConsultationContent
						weeklies={weeklies}
						availabilities={availabilities}
						refresh={fetchAvaibilities}
					/>
				</>
			)}
		</>
	);
};

export default AdviserConsultation;
