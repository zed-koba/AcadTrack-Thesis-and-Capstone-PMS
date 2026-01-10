import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

const Document = () => {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">My Documents</span>
					<span className="text-sm text-white">
						Upload and manage your academic documents
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					{/* <ConsultationDashboard weeklies={weeklies} />
					<ConsultationContent
						weeklies={weeklies}
						availabilities={availabilities}
						refresh={fetchAvaibilities}
					/> */}
				</>
			)}
		</>
	);
};

export default Document;
