import { getUserToken } from '@/components/functions/functions';
import { Spinner } from '@/components/ui/spinner';
import { apiInstructorUrl } from '@/Routes/http';
import { useEffect, useState } from 'react';
import type {
	ArchivingPendingProps,
	ArchivingProps,
} from '../interface/archiving';
import type { Deadlines } from '../interface/deadlines';
import ArchivingContent from '../components/ArchivingContent';

const InstructorArchiving = () => {
	const [loading, setLoading] = useState(false);
	const [archives, setArchiving] = useState<ArchivingProps[]>([]);
	const [documents, setDocumetns] = useState<ArchivingPendingProps[]>([]);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);

	const userToken = getUserToken();
	const fetchDatas = async () => {
		try {
			setLoading(true);
			const res = await fetch(`${apiInstructorUrl}/archiving`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
			});
			if (!res.ok) throw new Error('Faild to fetch data');
			const result = await res.json();
			setArchiving(result.archives);
			setDocumetns(result.documents);
			setDeadlines(result.deadlines);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDatas();
	}, []);

	return (
		<>
			<>
				<div className="flex items-center justify-between text-white text-base">
					<div className="flex items-start flex-col w-full justify-start">
						<span className="text-2xl text-white">Document Archive</span>
						<span className="text-sm text-white">
							Final approved thesis documents from your groups
						</span>
					</div>
				</div>
				{loading ? (
					<div className="w-full h-full flex justify-center items-center text-muted-foreground">
						<Spinner className="size-8" />
					</div>
				) : (
					<>
						<ArchivingContent
							documents={documents}
							archives={archives}
							deadlines={deadlines}
							refresh={fetchDatas}
						/>
					</>
				)}
			</>
		</>
	);
};

export default InstructorArchiving;
