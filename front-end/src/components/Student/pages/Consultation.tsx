import type { ProponentsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import type {
	AdviserAvailabilityProps,
	AdviserWeeklyProps,
} from '@/components/Adviser/interface/consultation';
import { information } from '@/components/functions/functions';
import { apiStudentUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import ConsultationDashboard from '../ConsultationComponents/ConsultationDashboard';
import { Spinner } from '@/components/ui/spinner';
import ConsultationContent from '../ConsultationComponents/ConsultationContent';

const Consultation = () => {
	const [loading, setLoading] = useState(false);
	const [weeklies, setWeeklies] = useState<AdviserWeeklyProps[]>([]);
	const [project, setProject] = useState<ProponentsDocumentsProps | null>(null);
	const [availabilities, setAvailabilities] = useState<
		AdviserAvailabilityProps[]
	>([]);
	const fetchSchedules = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${apiStudentUrl}/weekly`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});

			const result = await res.json();
			if (!res.ok) throw new Error('Failed to fetch data');
			if (result.status === 200) {
				await setWeeklies(result.schedules);
				await setProject(
					result.projects.find((p: ProponentsDocumentsProps) => {
						if (p.student_id === information.id) {
							return p;
						} else {
							return p.details.some(
								(detail) => detail.student.id === information.id,
							);
						}
					}) ?? null,
				);

				await setAvailabilities(result.availability);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchSchedules();
	}, []);

	return (
		<>
			<div className="flex items-start justify-between text-white text-base w-full h-full">
				<div className="flex items-start flex-col w-full justify-start h-full">
					<span className="text-2xl text-white">My Consultations</span>
					<span className="text-sm text-white">
						Book and schedule and manage your consultation sessions
					</span>
					{loading ? (
						<div className="w-full h-full flex justify-center items-center text-muted-foreground">
							<Spinner className="size-8" />
						</div>
					) : (
						<div className="grid lg:max-xl:grid-rows-[auto_1fr] xl:grid-cols-3 gap-6 w-full h-full">
							<div className="xl:col-span-2 space-y-6 lg:max-xl:row-start-2">
								<ConsultationContent
									weeklies={weeklies}
									project={project}
									availabilities={availabilities}
									refresh={fetchSchedules}
								/>
							</div>
							<div className="space-y-4 lg:max-xl:row-start-1">
								<ConsultationDashboard
									availabilities={availabilities}
									weeklies={weeklies}
									project={project}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Consultation;
