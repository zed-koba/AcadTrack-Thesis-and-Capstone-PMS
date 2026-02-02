import { Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import { CalendarDays, Calendar, Clock } from 'lucide-react';
import AvailabilityConsultation from './AvailabilityConsultationv2';
import type { ConsultationContentProps } from '../../interface/consultation';
import WeeklyConsultation from './WeeklyConsultation';
import DailyConsultation from './DailyConsultation';

const ConsultationContent = ({
	availabilities,
	weeklies,
	refresh,
}: ConsultationContentProps) => {
	return (
		<>
			<section className="space-y-4 w-full">
				<div className="w-auto overflow-x-auto">
					<Tabs defaultValue="weekly" className="w-full">
						<TabsList className="bg-muted/50 text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1">
							<TabsTrigger value="daily" className="gap-2">
								<CalendarDays className="w-4 h-4" />
								Daily
							</TabsTrigger>
							<TabsTrigger value="weekly" className="gap-2">
								<Calendar className="w-4 h-4" />
								Weekly
							</TabsTrigger>
							<TabsTrigger value="availability" className="gap-2">
								<Clock className="h-4 w-4" />
								Availability
							</TabsTrigger>
						</TabsList>
						<TabsContent value="weekly">
							<WeeklyConsultation weeklies={weeklies} refresh={refresh} />
						</TabsContent>
						<TabsContent value="daily">
							<DailyConsultation weeklies={weeklies} refresh={refresh} />
						</TabsContent>
						<TabsContent value="availability">
							<AvailabilityConsultation
								availabilities={availabilities}
								refresh={refresh}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</section>
		</>
	);
};

export default ConsultationContent;
