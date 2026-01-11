import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Search } from 'lucide-react';
import DocumentCard from './DocumentCard';
import DocumentUploadDialog from './DocumentUploadDialog';
import type { DocumentContentProps } from '../interface/document';

const DocumentContent = ({ documents, refresh }: DocumentContentProps) => {
	return (
		<>
			<section className="space-y-4 w-full">
				<div className="space-y-6 text-white">
					<div className="flex justify-between wrap-normal flex-wrap">
						<div className="grid grid-cols-2 max-w-160 grow shrink-0">
							<InputGroup>
								<InputGroupInput placeholder="Search...." />
								<InputGroupAddon>
									<Search className="h-5 w-5" />
								</InputGroupAddon>
								<InputGroupAddon align="inline-end">
									0 results...
								</InputGroupAddon>
							</InputGroup>
						</div>
						<DocumentUploadDialog refresh={refresh} />
					</div>
					<div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
						<DocumentCard documents={documents} />
					</div>
				</div>
			</section>
		</>
	);
};

export default DocumentContent;
