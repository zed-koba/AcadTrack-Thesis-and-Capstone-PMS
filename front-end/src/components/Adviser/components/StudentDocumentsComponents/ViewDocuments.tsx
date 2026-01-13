import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	Calendar,
	Clock,
	Download,
	Eye,
	FileText,
	History,
	MessageSquare,
} from 'lucide-react';
import type { ViewDocumentsProps } from '../../interface/adviserdocument';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadDocument, formatDate } from '@/components/functions/functions';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import DocumentDetails from './DocumentDetails';
import { cn } from '@/lib/utils';
import { apiStudentUrl } from '@/components/Routes/http';
import { toast } from 'sonner';

const ViewDocuments = ({
	documents,
	setSelectedStudent,
	refresh,
}: ViewDocumentsProps) => {
	const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
		null
	);
	const [open, setOpen] = useState(false);
	const statusColor = {
		pending: 'bg-amber-500/20 border-amber-500/40 text-amber-500',
		'under review': 'bg-success/20 border-success/40 text-success',
		'need revision': 'bg-red-500/20 border-red500/40 text-red-500',
		'approved': 'bg-green-500/20 border-green-500/40 text-green-500',
	};

	return (
		<>
			<div className="flex gap-2 text-white items-center p-2">
				<Button
					variant="ghost"
					onClick={() => {
						setSelectedStudent(true);
					}}
				>
					<ArrowLeft className="w-4 h-4" />
					{documents[0].student.name}
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
				{documents.map((doc) => (
					<Card className="transition-all duration-200 hover:shadow-md border">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="p-3 rounded-xl bg-primary/10">
										<FileText className="h-6 w-6 text-primary" />
									</div>
									<div>
										<CardTitle className="text-base">
											{doc.title_name}
										</CardTitle>
										<div className="text-xs text-muted-foreground flex gap-2 items-center">
											<div className="inline-flex gap-1 items-center">
												<History className="h-3.5 w-3.5" />
												v1{' '}
											</div>
											<div className="inline-flex gap-1 items-center">
												<Calendar className="h-3.5 w-3.5" />{' '}
												{formatDate(doc.created_at)}
											</div>
										</div>
									</div>
								</div>
								<div
									className={cn(
										'py-0.5 px-3 flex gap-1 items-center rounded-full mt-1 border',
										doc.status === 'pending' && statusColor.pending,
										doc.status === 'under review' &&
											statusColor['under review'],
										doc.status === 'need revision' &&
											statusColor['need revision'],
										doc.status === 'approved' && statusColor.approved
									)}
								>
									<Clock className="h-3 w-3" />
									<p className="text-xs font-medium capitalize">{doc.status}</p>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
								{doc.description}
							</p>
							<Separator className="mt-2 mb-4" />
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									className="flex-1 sm:flex-none"
									onClick={() => {
										setSelectedDocumentId(doc.id);
										setOpen(true);
									}}
								>
									<Eye className="h-4 w-4 mr-0.5" />
									View Details
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										downloadDocument(doc.id, doc.original_name);
									}}
								>
									<Download className="h-4 w-4 mr-0.5" />
									Download PDF
								</Button>
							</div>
						</CardContent>
						{selectedDocumentId !== null && (
							<DocumentDetails
								selectedDocumentId={selectedDocumentId}
								documents={documents}
								open={open}
								setOpen={setOpen}
								refresh={refresh}
							/>
						)}
					</Card>
				))}
			</div>
		</>
	);
};

export default ViewDocuments;
