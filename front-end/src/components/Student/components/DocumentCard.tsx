import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, MessageSquare } from 'lucide-react';
import { DocumentProps, type DocumentCardProps } from '../interface/document';
import { formatDate } from '@/components/functions/functions';
import { useState } from 'react';
import DocumentViewDialog from './DocumentViewDialog';

const DocumentCard = ({ documents }: DocumentCardProps) => {
	const [selectedDocument, setSelectedDocument] =
		useState<DocumentProps | null>(null);
	const [open, setOpen] = useState(false);
	return (
		<>
			{documents.map((doc) => (
				<Card className="hover:shadow-md transition-shadow">
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="p-3 rounded-lg bg-primary/10">
									<FileText className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base">{doc.title_name}</CardTitle>
									<p className="text-xs text-muted-foreground mt-1">
										Version 1 • Submitted {formatDate(doc.created_at)}
									</p>
								</div>
							</div>
							<div className="py-0.5 px-3 flex gap-1 items-center text-amber-500 bg-amber-500/20  rounded-full">
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
								variant="outline"
								size="sm"
								onClick={() => {
									setSelectedDocument(doc);
									setOpen(true);
								}}
							>
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
