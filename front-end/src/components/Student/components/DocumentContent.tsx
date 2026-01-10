import { Button } from '@/components/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Plus, Search, Upload } from 'lucide-react';
import DocumentCard from './DocumentCard';

const DocumentContent = () => {
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
						<Button variant="primary">
							<Upload className="h-4 w-4 mr-2" />
							Upload Document
						</Button>
					</div>
					<div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
						<DocumentCard />
					</div>
				</div>
			</section>
		</>
	);
};

export default DocumentContent;
