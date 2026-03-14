import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { DevelopmentMonitoringProps } from '../interface/development-process';
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DPMonitoringContent from './DPMonitoringContent';
import { Label } from '@/components/ui/label';

const DevelopmentMonitoring = ({
	projects,
	developments,
	refresh,
}: DevelopmentMonitoringProps) => {
	const [selectedId, setSelectedId] = useState<number | undefined>(
		projects.length > 0 ? projects[0].id : undefined,
	);
	if (projects.length === 0) {
		return (
			<>
				<div className="flex flex-col justify-center items-center opacity-50 h-screen">
					<BookOpen className="h-24 w-24 text-muted-foreground" />
					<p className="text-mb text-muted-foreground font-medium">
						There's not yet assigned thesis or capstone group in your advisory.
					</p>
				</div>
			</>
		);
	}

	const project = projects.find((p) => p.id === selectedId);
	const filteredDevelopments = developments.filter(
		(d) => d.foreign_proponents_id === project?.proponents_id,
	);

	return (
		<>
			<div className="mt-4 flex gap-2">
				<Label>Thesis/Capstone Groups: </Label>
				<Select
					value={String(selectedId)}
					onValueChange={(v) => setSelectedId(Number(v))}
				>
					<SelectTrigger className="w-[400px]">
						<SelectValue placeholder="Select a student project" />
					</SelectTrigger>
					<SelectContent>
						{projects.map((p) => (
							<SelectItem key={p.id} value={String(p.id)}>
								{p.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<DPMonitoringContent
				project={project}
				developments={filteredDevelopments}
				refresh={refresh}
			/>
		</>
	);
};

export default DevelopmentMonitoring;
