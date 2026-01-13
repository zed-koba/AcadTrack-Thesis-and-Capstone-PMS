import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Calendar,
	Clock,
	Eye,
	FileText,
	History,
	MessageSquare,
} from 'lucide-react';
import type { DocumentProps, DocumentCardProps } from '../interface/document';
import { formatDate } from '@/components/functions/functions';
import { useState } from 'react';
import DocumentViewDialog from './DocumentViewDialog';
import { cn } from '@/lib/utils';

const DocumentCard = ({ documents }: DocumentCardProps) => {
	const [selectedDocument, setSelectedDocument] =
		useState<DocumentProps | null>(null);
	const [open, setOpen] = useState(false);
	const statusColor = {
		pending: 'bg-amber-500/20 border-amber-500/40 text-amber-500',
		'under review': 'bg-success/20 border-success/40 text-success',
		'need revision': 'bg-red-500/20 border-red500/40 text-red-500',
		'approved': 'bg-green-500/20 border-green-500/40 text-green-500',
	};
	return (
		<>
			{documents.map((doc) => (
				<Card className="hover:shadow-md transition-shadow">
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="p-3 rounded-xl bg-primary/10">
									<FileText className="h-6 w-6 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base">{doc.title_name}</CardTitle>
									<p className="text-xs text-muted-foreground flex gap-2 items-center">
										<div className="inline-flex gap-1 items-center">
											<History className="h-3.5 w-3.5" />
											v1{' '}
										</div>
										<div className="inline-flex gap-1 items-center">
											<Calendar className="h-3.5 w-3.5" />{' '}
											{formatDate(doc.created_at)}
										</div>
									</p>
								</div>
							</div>
							<div
								className={cn(
									'py-0.5 px-3 flex gap-1 items-center text-amber-500 rounded-full mt-1 border',
									doc.status === 'pending' && statusColor.pending,
									doc.status === 'under review' && statusColor['under review'],
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
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<span className="flex items-center gap-1">
									<MessageSquare className="h-4 w-4" />5 comments
								</span>
								<span className="flex items-center gap-1"></span>
							</div>

							<Button
								size="sm"
								onClick={() => {
									setSelectedDocument(doc);
									setOpen(true);
								}}
							>
								<Eye className="h-4 w-4 mr-0.5" />
								View Details
							</Button>
						</div>
					</CardContent>
					{selectedDocument && (
						<DocumentViewDialog
							document={selectedDocument}
							open={open}
							setOpen={setOpen}
						/>
					)}
				</Card>
			))}
		</>
	);
};

export default DocumentCard;
