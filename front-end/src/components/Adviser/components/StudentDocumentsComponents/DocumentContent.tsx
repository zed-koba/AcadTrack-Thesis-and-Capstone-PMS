import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Search } from 'lucide-react';

import type {
	DocumentContentProps,
	DocumentProps,
} from '@/components/Student/interface/document';
import DocumentStudentCard from './DocumentStudentCard';
import { useState } from 'react';
import ViewDocuments from './ViewDocuments';

const DocumentContent = ({ documents, refresh }: DocumentContentProps) => {
	const [selectedStudent, setSelectedStudent] = useState(true);
	const [selectedStudentDocuments, setSelectedStudentDocuments] = useState<
		DocumentProps[]
	>([]);
	return (
		<>
			<section className="space-y-4 w-full">
				<div className="space-y-6 text-white">
					{selectedStudent ? (
						<>
							<div className="flex justify-between wrap-normal flex-wrap">
								<div className="grid grid-cols-2 grow shrink-0">
									<InputGroup>
										<InputGroupInput placeholder="Search students..." />
										<InputGroupAddon>
											<Search className="h-5 w-5" />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											0 results...
										</InputGroupAddon>
									</InputGroup>
								</div>
							</div>
							<div className="grid gap-3 xl:grid-cols-4 lg: grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
								<DocumentStudentCard
									documents={documents}
									setSelectedStudent={setSelectedStudent}
									setSelectedStudentDocuments={setSelectedStudentDocuments}
									refresh={refresh}
								/>
							</div>
						</>
					) : (
						<ViewDocuments
							documents={selectedStudentDocuments}
							setSelectedStudent={setSelectedStudent}
							refresh={refresh}
						/>
					)}
				</div>
			</section>
		</>
	);
};

export default DocumentContent;
